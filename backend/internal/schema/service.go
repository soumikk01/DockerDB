package schema

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	dbmodel "dockerdb/backend/internal/database"
)

// Column describes a table column.
type Column struct {
	Name     string `json:"name"`
	Type     string `json:"type"`
	Nullable bool   `json:"nullable"`
	Default  string `json:"default,omitempty"`
	IsPK     bool   `json:"is_primary_key"`
}

// Table describes a table with its columns.
type Table struct {
	Name    string   `json:"name"`
	Columns []Column `json:"columns"`
}

// Schema is the top-level schema summary for a database.
type Schema struct {
	Engine     string   `json:"engine"`
	DBName     string   `json:"db_name"`
	Tables     []Table  `json:"tables"`
	TableNames []string `json:"table_names"`
}

// Service inspects schema from a live database container.
type Service struct{}

func NewService() *Service { return &Service{} }

// GetSchema returns the full schema for the given database.
func (s *Service) GetSchema(ctx context.Context, db *dbmodel.Database) (*Schema, error) {
	switch db.Engine {
	case dbmodel.EnginePostgres:
		return postgresSchema(ctx, db)
	case dbmodel.EngineMySQL:
		return mysqlSchema(ctx, db)
	case dbmodel.EngineMongoDB:
		return mongoSchema(ctx, db)
	case dbmodel.EngineRedis:
		return redisSchema(ctx, db)
	}
	return nil, fmt.Errorf("unsupported engine: %s", db.Engine)
}

// ─── PostgreSQL ───────────────────────────────────────────────────────────────

func postgresSchema(ctx context.Context, db *dbmodel.Database) (*Schema, error) {
	dsn := fmt.Sprintf("host=localhost port=%d user=postgres password=%s dbname=%s sslmode=disable",
		db.HostPort, db.DBPassword, db.DBName)
	conn, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	// List tables
	tableRows, err := conn.QueryContext(ctx, `
		SELECT table_name FROM information_schema.tables
		WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
		ORDER BY table_name`)
	if err != nil {
		return nil, err
	}
	defer tableRows.Close()

	var tables []Table
	for tableRows.Next() {
		var t Table
		if err := tableRows.Scan(&t.Name); err != nil {
			continue
		}
		// Get columns
		cols, _ := postgresColumns(ctx, conn, t.Name)
		t.Columns = cols
		tables = append(tables, t)
	}

	names := make([]string, len(tables))
	for i, t := range tables {
		names[i] = t.Name
	}
	return &Schema{Engine: string(db.Engine), DBName: db.DBName, Tables: tables, TableNames: names}, nil
}

func postgresColumns(ctx context.Context, conn *sql.DB, table string) ([]Column, error) {
	rows, err := conn.QueryContext(ctx, `
		SELECT
			c.column_name,
			c.data_type,
			c.is_nullable,
			COALESCE(c.column_default, ''),
			CASE WHEN kcu.column_name IS NOT NULL THEN true ELSE false END AS is_pk
		FROM information_schema.columns c
		LEFT JOIN information_schema.key_column_usage kcu
			ON kcu.table_name = c.table_name
			AND kcu.column_name = c.column_name
			AND kcu.constraint_name IN (
				SELECT constraint_name FROM information_schema.table_constraints
				WHERE constraint_type = 'PRIMARY KEY' AND table_name = $1
			)
		WHERE c.table_name = $1 AND c.table_schema = 'public'
		ORDER BY c.ordinal_position`, table)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cols []Column
	for rows.Next() {
		var col Column
		var nullable string
		if err := rows.Scan(&col.Name, &col.Type, &nullable, &col.Default, &col.IsPK); err != nil {
			continue
		}
		col.Nullable = nullable == "YES"
		cols = append(cols, col)
	}
	return cols, nil
}

// ─── MySQL ────────────────────────────────────────────────────────────────────

func mysqlSchema(ctx context.Context, db *dbmodel.Database) (*Schema, error) {
	dsn := fmt.Sprintf("root:%s@tcp(localhost:%d)/%s?parseTime=true",
		db.DBPassword, db.HostPort, db.DBName)
	conn, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	tableRows, err := conn.QueryContext(ctx, `SHOW TABLES`)
	if err != nil {
		return nil, err
	}
	defer tableRows.Close()

	var tables []Table
	for tableRows.Next() {
		var t Table
		if err := tableRows.Scan(&t.Name); err != nil {
			continue
		}
		colRows, _ := conn.QueryContext(ctx,
			fmt.Sprintf("DESCRIBE `%s`", t.Name))
		if colRows != nil {
			for colRows.Next() {
				var col Column
				var key, extra string
				_ = colRows.Scan(&col.Name, &col.Type, &col.Nullable, &key, &col.Default, &extra)
				col.IsPK = key == "PRI"
				t.Columns = append(t.Columns, col)
			}
			colRows.Close()
		}
		tables = append(tables, t)
	}

	names := make([]string, len(tables))
	for i, t := range tables {
		names[i] = t.Name
	}
	return &Schema{Engine: string(db.Engine), DBName: db.DBName, Tables: tables, TableNames: names}, nil
}

// ─── MongoDB ─────────────────────────────────────────────────────────────────

func mongoSchema(ctx context.Context, db *dbmodel.Database) (*Schema, error) {
	uri := fmt.Sprintf("mongodb://localhost:%d", db.HostPort)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}
	defer client.Disconnect(ctx)

	colls, err := client.Database(db.DBName).ListCollectionNames(ctx, bson.D{})
	if err != nil {
		return nil, err
	}

	var tables []Table
	for _, c := range colls {
		tables = append(tables, Table{Name: c, Columns: []Column{}})
	}
	return &Schema{Engine: string(db.Engine), DBName: db.DBName, Tables: tables, TableNames: colls}, nil
}

// ─── Redis ────────────────────────────────────────────────────────────────────

func redisSchema(_ context.Context, db *dbmodel.Database) (*Schema, error) {
	return &Schema{
		Engine:     string(db.Engine),
		DBName:     db.DBName,
		Tables:     []Table{{Name: "keys", Columns: []Column{{Name: "key", Type: "string"}, {Name: "value", Type: "string"}}}},
		TableNames: []string{"keys"},
	}, nil
}
