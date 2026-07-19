package db

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

// Open opens (or creates) the SQLite meta-database and runs migrations.
func Open(path string) (*sql.DB, error) {
	conn, err := sql.Open("sqlite", path+"?_journal=WAL&_foreign_keys=on")
	if err != nil {
		return nil, err
	}
	conn.SetMaxOpenConns(1) // SQLite allows only one writer at a time
	if err := migrate(conn); err != nil {
		return nil, err
	}
	log.Printf("[db] SQLite ready at %s", path)
	return conn, nil
}

// migrate creates all required tables if they do not yet exist.
func migrate(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS user_databases (
		id            TEXT PRIMARY KEY,
		name          TEXT NOT NULL,
		engine        TEXT NOT NULL,
		version       TEXT NOT NULL,
		container_id  TEXT,
		container_name TEXT,
		host_port     INTEGER,
		db_password   TEXT,
		db_name       TEXT NOT NULL DEFAULT 'dockerdb',
		status        TEXT NOT NULL DEFAULT 'creating',
		created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS query_history (
		id           TEXT PRIMARY KEY,
		database_id  TEXT NOT NULL,
		query_text   TEXT NOT NULL,
		executed_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
		duration_ms  INTEGER,
		row_count    INTEGER,
		error        TEXT,
		FOREIGN KEY (database_id) REFERENCES user_databases(id) ON DELETE CASCADE
	);
	`
	_, err := db.Exec(schema)
	return err
}
