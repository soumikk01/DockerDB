package query

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/redis/go-redis/v9"

	dbmodel "dockerdb/backend/internal/database"
)

// Result is the unified query result returned to clients.
type Result struct {
	Columns  []string         `json:"columns"`
	Rows     []map[string]any `json:"rows"`
	RowCount int              `json:"row_count"`
	DurationMs int64          `json:"duration_ms"`
	Error    string           `json:"error,omitempty"`
}

// QueryRequest is the body for POST /api/v1/databases/:id/query.
type QueryRequest struct {
	Query string `json:"query" binding:"required"`
}

// Service executes queries against a user database container.
type Service struct{}

func NewService() *Service { return &Service{} }

// Execute routes the query to the correct driver.
func (s *Service) Execute(ctx context.Context, db *dbmodel.Database, queryText string) Result {
	start := time.Now()
	switch db.Engine {
	case dbmodel.EnginePostgres:
		return execPostgres(ctx, db, queryText, start)
	case dbmodel.EngineMySQL:
		return execMySQL(ctx, db, queryText, start)
	case dbmodel.EngineMongoDB:
		return execMongo(ctx, db, queryText, start)
	case dbmodel.EngineRedis:
		return execRedis(ctx, db, queryText, start)
	default:
		return Result{Error: fmt.Sprintf("unsupported engine: %s", db.Engine)}
	}
}

// ─── PostgreSQL ───────────────────────────────────────────────────────────────

func execPostgres(ctx context.Context, db *dbmodel.Database, query string, start time.Time) Result {
	dsn := fmt.Sprintf("host=localhost port=%d user=postgres password=%s dbname=%s sslmode=disable",
		db.HostPort, db.DBPassword, db.DBName)
	conn, err := sql.Open("postgres", dsn)
	if err != nil {
		return Result{Error: err.Error()}
	}
	defer conn.Close()

	rows, err := conn.QueryContext(ctx, query)
	if err != nil {
		return Result{Error: err.Error(), DurationMs: ms(start)}
	}
	defer rows.Close()
	return scanSQLRows(rows, start)
}

// ─── MySQL ────────────────────────────────────────────────────────────────────

func execMySQL(ctx context.Context, db *dbmodel.Database, query string, start time.Time) Result {
	dsn := fmt.Sprintf("root:%s@tcp(localhost:%d)/%s?parseTime=true",
		db.DBPassword, db.HostPort, db.DBName)
	conn, err := sql.Open("mysql", dsn)
	if err != nil {
		return Result{Error: err.Error()}
	}
	defer conn.Close()

	rows, err := conn.QueryContext(ctx, query)
	if err != nil {
		// MySQL exec statements (INSERT/UPDATE/DELETE) don't return rows
		res, execErr := conn.ExecContext(ctx, query)
		if execErr != nil {
			return Result{Error: err.Error(), DurationMs: ms(start)}
		}
		n, _ := res.RowsAffected()
		return Result{RowCount: int(n), DurationMs: ms(start)}
	}
	defer rows.Close()
	return scanSQLRows(rows, start)
}

// ─── MongoDB ─────────────────────────────────────────────────────────────────

func execMongo(ctx context.Context, db *dbmodel.Database, query string, start time.Time) Result {
	uri := fmt.Sprintf("mongodb://localhost:%d", db.HostPort)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return Result{Error: err.Error()}
	}
	defer client.Disconnect(ctx)

	// Interpret query as a collection name for simple listing
	coll := client.Database(db.DBName).Collection(query)
	cur, err := coll.Find(ctx, bson.D{}, options.Find().SetLimit(100))
	if err != nil {
		return Result{Error: err.Error(), DurationMs: ms(start)}
	}
	defer cur.Close(ctx)

	var results []map[string]any
	if err := cur.All(ctx, &results); err != nil {
		return Result{Error: err.Error(), DurationMs: ms(start)}
	}
	return Result{Rows: results, RowCount: len(results), DurationMs: ms(start)}
}

// ─── Redis ────────────────────────────────────────────────────────────────────

func execRedis(ctx context.Context, db *dbmodel.Database, query string, start time.Time) Result {
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("localhost:%d", db.HostPort),
		Password: db.DBPassword,
	})
	defer rdb.Close()

	result, err := rdb.Do(ctx, splitRedisArgs(query)...).Result()
	if err != nil {
		return Result{Error: err.Error(), DurationMs: ms(start)}
	}
	row := map[string]any{"result": fmt.Sprintf("%v", result)}
	return Result{Rows: []map[string]any{row}, RowCount: 1, DurationMs: ms(start)}
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

func scanSQLRows(rows *sql.Rows, start time.Time) Result {
	cols, err := rows.Columns()
	if err != nil {
		return Result{Error: err.Error()}
	}

	var results []map[string]any
	for rows.Next() {
		vals := make([]any, len(cols))
		ptrs := make([]any, len(cols))
		for i := range vals {
			ptrs[i] = &vals[i]
		}
		if err := rows.Scan(ptrs...); err != nil {
			continue
		}
		row := make(map[string]any, len(cols))
		for i, col := range cols {
			b, ok := vals[i].([]byte)
			if ok {
				row[col] = string(b)
			} else {
				row[col] = vals[i]
			}
		}
		results = append(results, row)
	}
	return Result{Columns: cols, Rows: results, RowCount: len(results), DurationMs: ms(start)}
}

func ms(start time.Time) int64 {
	return time.Since(start).Milliseconds()
}

func splitRedisArgs(cmd string) []any {
	parts := splitStr(cmd)
	args := make([]any, len(parts))
	for i, p := range parts {
		args[i] = p
	}
	return args
}

func splitStr(s string) []string {
	var parts []string
	current := ""
	inQuote := false
	for _, ch := range s {
		switch {
		case ch == '"' || ch == '\'':
			inQuote = !inQuote
		case ch == ' ' && !inQuote:
			if current != "" {
				parts = append(parts, current)
				current = ""
			}
		default:
			current += string(ch)
		}
	}
	if current != "" {
		parts = append(parts, current)
	}
	return parts
}
