package schema

import (
	"github.com/gin-gonic/gin"

	dbmodel "dockerdb/backend/internal/database"
	"dockerdb/backend/pkg/response"
)

// Handler handles schema inspection requests.
type Handler struct {
	svc   *Service
	dbSvc *dbmodel.Service
}

// NewHandler creates a new schema handler.
func NewHandler(svc *Service, dbSvc *dbmodel.Service) *Handler {
	return &Handler{svc: svc, dbSvc: dbSvc}
}

// RegisterRoutes attaches schema routes to the given router group.
// Expected prefix: /api/v1/databases/:id
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/:id/schema", h.GetSchema)
	rg.GET("/:id/tables", h.ListTables)
	rg.GET("/:id/tables/:table", h.GetTable)
}

// GetSchema godoc
// GET /api/v1/databases/:id/schema
func (h *Handler) GetSchema(c *gin.Context) {
	db, err := h.dbSvc.Get(c.Request.Context(), c.Param("id"))
	if err != nil || db == nil {
		response.NotFound(c, "database not found")
		return
	}
	schema, err := h.svc.GetSchema(c.Request.Context(), db)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, schema)
}

// ListTables godoc
// GET /api/v1/databases/:id/tables
func (h *Handler) ListTables(c *gin.Context) {
	db, err := h.dbSvc.Get(c.Request.Context(), c.Param("id"))
	if err != nil || db == nil {
		response.NotFound(c, "database not found")
		return
	}
	schema, err := h.svc.GetSchema(c.Request.Context(), db)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, schema.TableNames)
}

// GetTable godoc
// GET /api/v1/databases/:id/tables/:table
func (h *Handler) GetTable(c *gin.Context) {
	db, err := h.dbSvc.Get(c.Request.Context(), c.Param("id"))
	if err != nil || db == nil {
		response.NotFound(c, "database not found")
		return
	}
	schema, err := h.svc.GetSchema(c.Request.Context(), db)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	targetTable := c.Param("table")
	for _, t := range schema.Tables {
		if t.Name == targetTable {
			response.OK(c, t)
			return
		}
	}
	response.NotFound(c, "table not found")
}
