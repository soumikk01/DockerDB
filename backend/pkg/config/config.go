package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all runtime configuration sourced from environment variables.
type Config struct {
	Port        string
	FrontendURL string
	SQLitePath  string
	DockerHost  string
}

// Load reads .env if present, then maps env vars into a Config struct.
func Load() *Config {
	// Ignore error — .env is optional in production
	_ = godotenv.Load()

	cfg := &Config{
		Port:        getEnv("BACKEND_PORT", "8080"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),
		SQLitePath:  getEnv("SQLITE_PATH", "./dockerdb.sqlite"),
		DockerHost:  getEnv("DOCKER_HOST", ""),
	}

	log.Printf("[config] port=%s sqlite=%s", cfg.Port, cfg.SQLitePath)
	return cfg
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
