package database

import "time"

// Engine represents a supported database engine.
type Engine string

const (
	EnginePostgres Engine = "postgresql"
	EngineMySQL    Engine = "mysql"
	EngineMongoDB  Engine = "mongodb"
	EngineRedis    Engine = "redis"
)

// Status represents the lifecycle state of a database container.
type Status string

const (
	StatusCreating Status = "creating"
	StatusRunning  Status = "running"
	StatusStopped  Status = "stopped"
	StatusError    Status = "error"
)

// Database is the core entity stored in SQLite.
type Database struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Engine        Engine    `json:"engine"`
	Version       string    `json:"version"`
	ContainerID   string    `json:"container_id,omitempty"`
	ContainerName string    `json:"container_name,omitempty"`
	HostPort      int       `json:"host_port"`
	DBPassword    string    `json:"db_password,omitempty"`
	DBName        string    `json:"db_name"`
	Status        Status    `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// ConnectionInfo is returned to the frontend when requesting a connection string.
type ConnectionInfo struct {
	DatabaseID    string `json:"database_id"`
	Engine        Engine `json:"engine"`
	Host          string `json:"host"`
	Port          int    `json:"port"`
	DatabaseName  string `json:"database_name"`
	Username      string `json:"username"`
	Password      string `json:"password"`
	ConnectionURL string `json:"connection_url"`
	// ORM-ready snippets
	PrismaSchema  string `json:"prisma_schema,omitempty"`
	DrizzleConfig string `json:"drizzle_config,omitempty"`
}

// CreateRequest is the body for POST /api/v1/databases.
type CreateRequest struct {
	Name    string `json:"name"    binding:"required"`
	Engine  Engine `json:"engine"  binding:"required"`
	Version string `json:"version"`
	DBName  string `json:"db_name"`
}

// QueryHistory represents a recorded query execution.
type QueryHistory struct {
	ID         string    `json:"id"`
	DatabaseID string    `json:"database_id"`
	QueryText  string    `json:"query_text"`
	ExecutedAt time.Time `json:"executed_at"`
	DurationMs int64     `json:"duration_ms"`
	RowCount   int       `json:"row_count"`
	Error      string    `json:"error,omitempty"`
}
