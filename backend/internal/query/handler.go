package query

import (
	"database/sql"

	"github.com/gin-gonic/gin"

	dbmodel "dockerdb/backend/internal/database"
	"dockerdb/backend/pkg/response"
)

// Handler handles query execution requests.
type Handler struct {
	svc    *Service
	dbSvc  *dbmodel.Service
	metaDB *sql.DB
}

// NewHandler creates a new query handler.
func NewHandler(svc *Service, dbSvc *dbmodel.Service, metaDB *sql.DB) *Handler {
	return &Handler{svc: svc, dbSvc: dbSvc, metaDB: metaDB}
}

// RegisterRoutes attaches the query route to the given router group.
// Expected prefix: /api/v1/databases/:id
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("/:id/query", h.Execute)
	rg.GET("/:id/history", h.History)
}

// Execute godoc
// POST /api/v1/databases/:id/query
func (h *Handler) Execute(c *gin.Context) {
	var req QueryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	db, err := h.dbSvc.Get(c.Request.Context(), c.Param("id"))
	if err != nil || db == nil {
		response.NotFound(c, "database not found")
		return
	}

	result := h.svc.Execute(c.Request.Context(), db, req.Query)

	// Persist history (best-effort)
	go func() {
		errStr := result.Error
		h.metaDB.Exec(`
			INSERT INTO query_history (id, database_id, query_text, duration_ms, row_count, error)
			VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?)`,
			db.ID, req.Query, result.DurationMs, result.RowCount, errStr)
	}()

	response.OK(c, result)
}

// History godoc
// GET /api/v1/databases/:id/history
func (h *Handler) History(c *gin.Context) {
	rows, err := h.metaDB.QueryContext(c.Request.Context(), `
		SELECT id, database_id, query_text, executed_at, duration_ms, row_count, error
		FROM query_history WHERE database_id = ? ORDER BY executed_at DESC LIMIT 100`,
		c.Param("id"))
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	defer rows.Close()

	var history []dbmodel.QueryHistory
	for rows.Next() {
		var q dbmodel.QueryHistory
		if err := rows.Scan(&q.ID, &q.DatabaseID, &q.QueryText,
			&q.ExecutedAt, &q.DurationMs, &q.RowCount, &q.Error); err != nil {
			continue
		}
		history = append(history, q)
	}
	if history == nil {
		history = []dbmodel.QueryHistory{}
	}
	response.OK(c, history)
}
