package database

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"dockerdb/backend/pkg/response"
)

// Handler holds a reference to the database service.
type Handler struct {
	svc *Service
}

// NewHandler creates a new database handler.
func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

// RegisterRoutes attaches all database routes to the given router group.
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("", h.List)
	rg.POST("", h.Create)
	rg.GET("/:id", h.Get)
	rg.DELETE("/:id", h.Delete)
	rg.POST("/:id/start", h.Start)
	rg.POST("/:id/stop", h.Stop)
	rg.GET("/:id/status", h.Status)
	rg.GET("/:id/connect", h.Connect)
}

// List godoc
// GET /api/v1/databases
func (h *Handler) List(c *gin.Context) {
	dbs, err := h.svc.List(c.Request.Context())
	if err != nil {
		response.InternalError(c, "failed to list databases")
		return
	}
	if dbs == nil {
		dbs = []Database{}
	}
	response.OK(c, dbs)
}

// Create godoc
// POST /api/v1/databases
func (h *Handler) Create(c *gin.Context) {
	var req CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	db, err := h.svc.Create(c.Request.Context(), req)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.Created(c, db)
}

// Get godoc
// GET /api/v1/databases/:id
func (h *Handler) Get(c *gin.Context) {
	db, err := h.svc.Get(c.Request.Context(), c.Param("id"))
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	if db == nil {
		response.NotFound(c, "database not found")
		return
	}
	response.OK(c, db)
}

// Delete godoc
// DELETE /api/v1/databases/:id
func (h *Handler) Delete(c *gin.Context) {
	if err := h.svc.Delete(c.Request.Context(), c.Param("id")); err != nil {
		response.InternalError(c, err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}

// Start godoc
// POST /api/v1/databases/:id/start
func (h *Handler) Start(c *gin.Context) {
	if err := h.svc.Start(c.Request.Context(), c.Param("id")); err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, gin.H{"message": "database started"})
}

// Stop godoc
// POST /api/v1/databases/:id/stop
func (h *Handler) Stop(c *gin.Context) {
	if err := h.svc.Stop(c.Request.Context(), c.Param("id")); err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, gin.H{"message": "database stopped"})
}

// Status godoc
// GET /api/v1/databases/:id/status
func (h *Handler) Status(c *gin.Context) {
	status, err := h.svc.LiveStatus(c.Request.Context(), c.Param("id"))
	if err != nil {
		response.NotFound(c, err.Error())
		return
	}
	response.OK(c, gin.H{"status": status})
}

// Connect godoc
// GET /api/v1/databases/:id/connect
func (h *Handler) Connect(c *gin.Context) {
	db, err := h.svc.Get(c.Request.Context(), c.Param("id"))
	if err != nil || db == nil {
		response.NotFound(c, "database not found")
		return
	}
	info := h.svc.ConnectionInfo(db)
	response.OK(c, info)
}
