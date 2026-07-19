package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"dockerdb/backend/internal/database"
	dockersvc "dockerdb/backend/internal/docker"
	"dockerdb/backend/internal/query"
	"dockerdb/backend/internal/schema"
	"dockerdb/backend/internal/ws"
	"dockerdb/backend/pkg/config"
	metadb "dockerdb/backend/pkg/db"
)

func main() {
	// ── Load config ────────────────────────────────────────────────────────────
	cfg := config.Load()

	// ── Open meta-database (SQLite) ────────────────────────────────────────────
	sqliteDB, err := metadb.Open(cfg.SQLitePath)
	if err != nil {
		log.Fatalf("[main] failed to open meta database: %v", err)
	}
	defer sqliteDB.Close()

	// ── Connect to Docker daemon ───────────────────────────────────────────────
	docker, err := dockersvc.New()
	if err != nil {
		log.Fatalf("[main] %v", err)
	}

	// ── Wire up services ───────────────────────────────────────────────────────
	dbSvc := database.NewService(sqliteDB, docker)
	dbHandler := database.NewHandler(dbSvc)

	querySvc := query.NewService()
	queryHandler := query.NewHandler(querySvc, dbSvc, sqliteDB)

	schemaSvc := schema.NewService()
	schemaHandler := schema.NewHandler(schemaSvc, dbSvc)

	wsHandler := ws.NewHandler(dbSvc, docker)

	// ── Set up Gin ─────────────────────────────────────────────────────────────
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	// CORS — allow any localhost origin (open-source local dev tool)
	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
	}))

	// ── Health check ───────────────────────────────────────────────────────────
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "dockerdb-backend"})
	})

	// ── API v1 ─────────────────────────────────────────────────────────────────
	v1 := r.Group("/api/v1")
	{
		// Database lifecycle
		dbs := v1.Group("/databases")
		dbHandler.RegisterRoutes(dbs)

		// Query execution + history (sub-routes under /databases/:id)
		queryHandler.RegisterRoutes(v1.Group("/databases"))

		// Schema inspection (sub-routes under /databases/:id)
		schemaHandler.RegisterRoutes(v1.Group("/databases"))
	}

	// ── WebSocket ──────────────────────────────────────────────────────────────
	wsGroup := r.Group("/ws")
	wsHandler.RegisterRoutes(wsGroup)

	// ── Start server ───────────────────────────────────────────────────────────
	addr := ":" + cfg.Port
	log.Printf("[main] DockerDB backend listening on http://localhost%s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("[main] server error: %v", err)
	}
}
