/**
 * DockerDB API Client
 * Talks to the Go backend at http://localhost:8080
 */

const BASE = 'http://localhost:8080/api/v1';

// ── Types ──────────────────────────────────────────────────────────────────────

export type Engine = 'postgresql' | 'mysql' | 'mongodb' | 'redis';
export type DBStatus = 'creating' | 'running' | 'stopped' | 'error';

export interface Database {
  id: string;
  name: string;
  engine: Engine;
  version: string;
  container_id: string;
  container_name: string;
  host_port: number;
  db_name: string;
  status: DBStatus;
  created_at: string;
  updated_at: string;
}

export interface ConnectionInfo {
  database_id: string;
  engine: Engine;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password: string;
  connection_url: string;
  prisma_schema?: string;
  drizzle_config?: string;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  row_count: number;
  duration_ms: number;
  error?: string;
}

export interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  is_primary_key: boolean;
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

export interface Schema {
  engine: string;
  db_name: string;
  tables: SchemaTable[];
  table_names: string[];
}

export interface QueryHistory {
  id: string;
  database_id: string;
  query_text: string;
  executed_at: string;
  duration_ms: number;
  row_count: number;
  error?: string;
}

// ── API helpers ────────────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }
  return json.data as T;
}

// ── Databases ──────────────────────────────────────────────────────────────────

export const api = {
  databases: {
    /** List all provisioned databases */
    list: () => request<Database[]>('/databases'),

    /** Get a single database by ID */
    get: (id: string) => request<Database>(`/databases/${id}`),

    /** Create and provision a new Docker-backed database */
    create: (body: { name: string; engine: Engine; version?: string; db_name?: string }) =>
      request<Database>('/databases', { method: 'POST', body: JSON.stringify(body) }),

    /** Delete a database and remove its container */
    delete: (id: string) =>
      fetch(`${BASE}/databases/${id}`, { method: 'DELETE' }).then(() => {}),

    /** Start a stopped container */
    start: (id: string) =>
      request<{ message: string }>(`/databases/${id}/start`, { method: 'POST' }),

    /** Stop a running container */
    stop: (id: string) =>
      request<{ message: string }>(`/databases/${id}/stop`, { method: 'POST' }),

    /** Get live container status */
    status: (id: string) =>
      request<{ status: string }>(`/databases/${id}/status`),

    /** Get connection string and ORM snippets */
    connect: (id: string) => request<ConnectionInfo>(`/databases/${id}/connect`),
  },

  query: {
    /** Execute a query against a database */
    execute: (id: string, query: string) =>
      request<QueryResult>(`/databases/${id}/query`, {
        method: 'POST',
        body: JSON.stringify({ query }),
      }),

    /** Get query history for a database */
    history: (id: string) => request<QueryHistory[]>(`/databases/${id}/history`),
  },

  schema: {
    /** Get full schema (tables + columns) */
    get: (id: string) => request<Schema>(`/databases/${id}/schema`),

    /** Get list of table names */
    tables: (id: string) => request<string[]>(`/databases/${id}/tables`),

    /** Get a specific table's columns */
    table: (id: string, table: string) =>
      request<SchemaTable>(`/databases/${id}/tables/${table}`),
  },

  /** Health check */
  health: () =>
    fetch('http://localhost:8080/health')
      .then((r) => r.json())
      .catch(() => ({ status: 'offline' })),
};
