# DockerDB

> **Open-source local database development tool.**
> Spin up production-grade databases instantly in Docker, get a connection URL, and wire it into your app — no cloud accounts, no config files.

---

## What it does

1. You pick a database engine (PostgreSQL, MySQL, MongoDB, Redis)
2. DockerDB pulls the Docker image and starts a container on your machine
3. DockerDB generates a connection URL and ORM snippets (Prisma, Drizzle)
4. You paste that URL into your app's `.env` and start building

---

## Requirements

| Tool | Purpose |
|---|---|
| [Node.js 18+](https://nodejs.org) | Run the Next.js frontend |
| [Go 1.22+](https://go.dev/dl/) | Run the Go backend |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Run database containers |

---

## Quick Start

### 1 — Clone the repo

```bash
git clone https://github.com/soumikk01/DockerDB.git
cd DockerDB
```

### 2 — Start the Go backend

```bash
cd backend
go run ./cmd/server
```

You should see:
```
[docker] Connected to Docker Desktop via named pipe
[main] DockerDB backend listening on http://localhost:8080
```

### 3 — Start the Next.js frontend

In a **separate terminal**:

```bash
# (from project root)
npm install
npm run dev
```

### 4 — Open the app

Go to **http://localhost:3000**

### 5 — Pick a database

Click **Get Started** → choose a database engine → DockerDB will:
- Pull the Docker image (first time only, may take 1–2 minutes)
- Start the container
- Generate your connection URL

### 6 — Use it in your app

Copy the connection URL shown in the **Database Management** panel and add it to your app:

```env
# .env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/myapp
```

---

## Architecture

```
DockerDB/
├── backend/          # Go backend (Gin + Docker REST API + SQLite)
│   ├── cmd/server/   # Entry point
│   ├── internal/     # Business logic (database, docker, query, schema, ws)
│   └── pkg/          # Shared packages (config, db, response)
│
└── src/              # Next.js frontend
    ├── app/          # Pages (home, select-database, workspace)
    ├── components/   # UI components + workspace panels
    ├── lib/api.ts    # Typed API client
    └── styles/       # SCSS styles
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/databases` | List all databases |
| POST | `/api/v1/databases` | Create + provision Docker container |
| GET | `/api/v1/databases/:id/connect` | Get connection string + ORM snippets |
| POST | `/api/v1/databases/:id/query` | Execute a query |
| GET | `/api/v1/databases/:id/schema` | Get schema (tables, columns) |
| WS | `/ws/databases/:id/logs` | Live container log stream |

---

## Supported Databases

| Engine | Version | Default Port |
|--------|---------|--------------|
| PostgreSQL | 16 | 5432 |
| MySQL | 8 | 3306 |
| MongoDB | 7 | 27017 |
| Redis | 7 | 6379 |

---

## License

MIT
