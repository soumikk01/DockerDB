package database

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/google/uuid"

	dockersvc "dockerdb/backend/internal/docker"
)

// Service handles business logic for database provisioning.
type Service struct {
	db     *sql.DB
	docker *dockersvc.Service
}

// NewService creates a new database service.
func NewService(db *sql.DB, docker *dockersvc.Service) *Service {
	return &Service{db: db, docker: docker}
}

// engineDefaults maps engine → (dockerImage, containerPort, defaultVersion, defaultUser).
type engineDefaults struct {
	image         string
	containerPort string
	defaultVer    string
	user          string
}

var defaults = map[Engine]engineDefaults{
	EnginePostgres: {"postgres", "5432", "16", "postgres"},
	EngineMySQL:    {"mysql", "3306", "8", "root"},
	EngineMongoDB:  {"mongo", "27017", "7", ""},
	EngineRedis:    {"redis", "6379", "7", ""},
}

// List returns all databases from the meta store.
func (s *Service) List(ctx context.Context) ([]Database, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, name, engine, version, container_id, container_name,
		       host_port, db_password, db_name, status, created_at, updated_at
		FROM user_databases ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var dbs []Database
	for rows.Next() {
		var d Database
		if err := rows.Scan(&d.ID, &d.Name, &d.Engine, &d.Version,
			&d.ContainerID, &d.ContainerName, &d.HostPort,
			&d.DBPassword, &d.DBName, &d.Status,
			&d.CreatedAt, &d.UpdatedAt); err != nil {
			return nil, err
		}
		dbs = append(dbs, d)
	}
	return dbs, nil
}

// Get returns a single database by ID.
func (s *Service) Get(ctx context.Context, id string) (*Database, error) {
	var d Database
	err := s.db.QueryRowContext(ctx, `
		SELECT id, name, engine, version, container_id, container_name,
		       host_port, db_password, db_name, status, created_at, updated_at
		FROM user_databases WHERE id = ?`, id).
		Scan(&d.ID, &d.Name, &d.Engine, &d.Version,
			&d.ContainerID, &d.ContainerName, &d.HostPort,
			&d.DBPassword, &d.DBName, &d.Status,
			&d.CreatedAt, &d.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &d, err
}

// Create provisions a new Docker-backed database container.
func (s *Service) Create(ctx context.Context, req CreateRequest) (*Database, error) {
	def, ok := defaults[req.Engine]
	if !ok {
		return nil, fmt.Errorf("unsupported engine: %s", req.Engine)
	}

	version := req.Version
	if version == "" {
		version = def.defaultVer
	}
	dbName := req.DBName
	if dbName == "" {
		dbName = "dockerdb"
	}

	id := uuid.New().String()
	password := randomHex(16)
	containerName := fmt.Sprintf("dockerdb-%s-%s", req.Engine, id[:8])

	// Determine image tag
	imgTag := fmt.Sprintf("%s:%s", def.image, version)

	// Build env vars per engine
	env := buildEnv(req.Engine, dbName, password)

	// Find a free host port
	hostPort := dockersvc.FindFreePort(portStart(req.Engine))

	// Provision container in background (may take a while due to image pull)
	d := &Database{
		ID:            id,
		Name:          req.Name,
		Engine:        req.Engine,
		Version:       version,
		ContainerName: containerName,
		HostPort:      hostPort,
		DBPassword:    password,
		DBName:        dbName,
		Status:        StatusCreating,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	// Persist with "creating" status first so the client can poll
	if err := s.insertDB(ctx, d); err != nil {
		return nil, err
	}

	// Spin up the container asynchronously
	go func() {
		bgCtx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
		defer cancel()

		containerID, err := s.docker.CreateAndStart(bgCtx, dockersvc.ContainerConfig{
			ContainerName: containerName,
			Image:         imgTag,
			Env:           env,
			HostPort:      hostPort,
			ContainerPort: def.containerPort,
		})
		if err != nil {
			log.Printf("[database] container provision failed for %s: %v", containerName, err)
			_ = s.updateStatus(bgCtx, id, "", StatusError)
			return
		}
		log.Printf("[database] container %s running (id=%s port=%d)", containerName, containerID[:12], hostPort)
		_ = s.updateStatus(bgCtx, id, containerID, StatusRunning)
	}()

	return d, nil
}

// Start starts a stopped container.
func (s *Service) Start(ctx context.Context, id string) error {
	d, err := s.Get(ctx, id)
	if err != nil || d == nil {
		return fmt.Errorf("database not found")
	}
	if err := s.docker.Start(ctx, d.ContainerID); err != nil {
		return err
	}
	return s.updateStatus(ctx, id, d.ContainerID, StatusRunning)
}

// Stop stops a running container.
func (s *Service) Stop(ctx context.Context, id string) error {
	d, err := s.Get(ctx, id)
	if err != nil || d == nil {
		return fmt.Errorf("database not found")
	}
	if err := s.docker.Stop(ctx, d.ContainerID); err != nil {
		return err
	}
	return s.updateStatus(ctx, id, d.ContainerID, StatusStopped)
}

// Delete stops and removes the container, then deletes the record.
func (s *Service) Delete(ctx context.Context, id string) error {
	d, err := s.Get(ctx, id)
	if err != nil || d == nil {
		return fmt.Errorf("database not found")
	}
	if d.ContainerID != "" {
		_ = s.docker.Remove(ctx, d.ContainerID)
	}
	_, err = s.db.ExecContext(ctx, `DELETE FROM user_databases WHERE id = ?`, id)
	return err
}

// LiveStatus fetches the live Docker status for a database.
func (s *Service) LiveStatus(ctx context.Context, id string) (string, error) {
	d, err := s.Get(ctx, id)
	if err != nil || d == nil {
		return "", fmt.Errorf("database not found")
	}
	if d.ContainerID == "" {
		return string(d.Status), nil
	}
	return s.docker.Status(ctx, d.ContainerID), nil
}

// ConnectionInfo builds the connection details for a database.
func (s *Service) ConnectionInfo(d *Database) ConnectionInfo {
	ci := ConnectionInfo{
		DatabaseID:   d.ID,
		Engine:       d.Engine,
		Host:         "localhost",
		Port:         d.HostPort,
		DatabaseName: d.DBName,
		Password:     d.DBPassword,
	}

	switch d.Engine {
	case EnginePostgres:
		ci.Username = "postgres"
		ci.ConnectionURL = fmt.Sprintf("postgresql://postgres:%s@localhost:%d/%s", d.DBPassword, d.HostPort, d.DBName)
		ci.PrismaSchema = fmt.Sprintf(`datasource db {
  provider = "postgresql"
  url      = "%s"
}`, ci.ConnectionURL)
		ci.DrizzleConfig = fmt.Sprintf(`import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const pool = new Pool({ connectionString: "%s" });
export const db = drizzle(pool);`, ci.ConnectionURL)

	case EngineMySQL:
		ci.Username = "root"
		ci.ConnectionURL = fmt.Sprintf("mysql://root:%s@localhost:%d/%s", d.DBPassword, d.HostPort, d.DBName)
		ci.PrismaSchema = fmt.Sprintf(`datasource db {
  provider = "mysql"
  url      = "%s"
}`, ci.ConnectionURL)

	case EngineMongoDB:
		ci.Username = ""
		ci.ConnectionURL = fmt.Sprintf("mongodb://localhost:%d/%s", d.HostPort, d.DBName)

	case EngineRedis:
		ci.Username = ""
		ci.ConnectionURL = fmt.Sprintf("redis://:%s@localhost:%d", d.DBPassword, d.HostPort)
	}

	return ci
}

// ─── helpers ─────────────────────────────────────────────────────────────────

func (s *Service) insertDB(ctx context.Context, d *Database) error {
	_, err := s.db.ExecContext(ctx, `
		INSERT INTO user_databases
			(id, name, engine, version, container_id, container_name,
			 host_port, db_password, db_name, status, created_at, updated_at)
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
		d.ID, d.Name, d.Engine, d.Version, d.ContainerID, d.ContainerName,
		d.HostPort, d.DBPassword, d.DBName, d.Status,
		d.CreatedAt, d.UpdatedAt)
	return err
}

func (s *Service) updateStatus(ctx context.Context, id, containerID string, status Status) error {
	_, err := s.db.ExecContext(ctx, `
		UPDATE user_databases
		SET container_id=?, status=?, updated_at=?
		WHERE id=?`,
		containerID, status, time.Now(), id)
	return err
}

func buildEnv(engine Engine, dbName, password string) []string {
	switch engine {
	case EnginePostgres:
		return []string{
			"POSTGRES_PASSWORD=" + password,
			"POSTGRES_DB=" + dbName,
		}
	case EngineMySQL:
		return []string{
			"MYSQL_ROOT_PASSWORD=" + password,
			"MYSQL_DATABASE=" + dbName,
		}
	case EngineMongoDB:
		return []string{}
	case EngineRedis:
		return []string{"REDIS_PASSWORD=" + password}
	}
	return nil
}

func portStart(engine Engine) int {
	switch engine {
	case EnginePostgres:
		return 5432
	case EngineMySQL:
		return 3306
	case EngineMongoDB:
		return 27017
	case EngineRedis:
		return 6379
	}
	return 5400
}

func randomHex(n int) string {
	b := make([]byte, n)
	_, _ = rand.Read(b)
	return strings.ToLower(hex.EncodeToString(b))
}
