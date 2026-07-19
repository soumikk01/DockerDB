package ws

import (
	"bufio"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	dbmodel "dockerdb/backend/internal/database"
	dockersvc "dockerdb/backend/internal/docker"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // Allow all origins (CORS handled by Gin)
}

// Handler handles WebSocket connections for live container log streaming.
type Handler struct {
	dbSvc  *dbmodel.Service
	docker *dockersvc.Service
}

// NewHandler creates a new WebSocket handler.
func NewHandler(dbSvc *dbmodel.Service, docker *dockersvc.Service) *Handler {
	return &Handler{dbSvc: dbSvc, docker: docker}
}

// RegisterRoutes attaches the WebSocket route.
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/databases/:id/logs", h.StreamLogs)
}

// StreamLogs upgrades the HTTP connection to WebSocket and streams Docker container logs.
// WS /ws/databases/:id/logs
func (h *Handler) StreamLogs(c *gin.Context) {
	db, err := h.dbSvc.Get(c.Request.Context(), c.Param("id"))
	if err != nil || db == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "database not found"})
		return
	}
	if db.ContainerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "container not yet provisioned"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("[ws] upgrade error: %v", err)
		return
	}
	defer conn.Close()

	// The context from the WS connection — cancelled when client disconnects
	ctx := c.Request.Context()

	logStream, err := h.docker.Logs(ctx, db.ContainerID)
	if err != nil {
		_ = conn.WriteMessage(websocket.TextMessage, []byte("error: "+err.Error()))
		return
	}
	defer logStream.Close()

	scanner := bufio.NewScanner(logStream)
	for scanner.Scan() {
		select {
		case <-ctx.Done():
			return
		default:
			line := scanner.Text()
			if len(line) > 8 {
				// Strip Docker's 8-byte framing header
				line = line[8:]
			}
			if err := conn.WriteMessage(websocket.TextMessage, []byte(line)); err != nil {
				log.Printf("[ws] write error: %v", err)
				return
			}
		}
	}
}
