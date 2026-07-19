<p align="center">
  <img src="public/logo.svg" alt="DockerDB Logo" width="300" />
</p>

<h1 align="center">DockerDB</h1>

<p align="center">
  <b>Instant, Production-Grade Local Databases in Docker</b><br/>
  Spin up PostgreSQL, MySQL, MongoDB, and Redis in seconds with zero cloud friction, instant connection strings, and interactive GUI management.
</p>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Status-Active_Development-brightgreen" alt="Status" /></a>
  <a href="https://golang.org/"><img src="https://img.shields.io/badge/Go-1.22+-00ADD8?logo=go&logoColor=white" alt="Go Version" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15+-000000?logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-Desktop-2496ED?logo=docker&logoColor=white" alt="Docker" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
</p>

---

## 📌 Overview

**DockerDB** is an open-source, local-first database development platform designed for developers who want fast, clean, and isolated database instances without configuring complex Docker CLI commands or managing cloud accounts manually.

With DockerDB, you can select your database engine, launch a lightweight container on your machine, copy pre-generated connection URLs or ORM snippets (Prisma, Drizzle, etc.), and start querying and visually inspecting your schema immediately.

---

## 🔥 Key Features & Highlights

- ⚡ **1-Click Container Provisioning**: Spin up PostgreSQL, MySQL, MongoDB, or Redis instances powered by local Docker containers.
- 🔗 **Instant Connection Strings & ORM Snippets**: Get auto-configured `.env` strings and ready-to-use boilerplate for Prisma, Drizzle, TypeORM, and raw database drivers.
- 📊 **Visual Workspace & Schema Visualizer**: View database tables, explore entity relationships, inspect column types, indexes, and primary/foreign keys visually.
- 💻 **Interactive Query Runner**: Execute raw SQL and database queries directly from your web browser with structured tabular results.
- 📡 **Real-Time Live Container Logs**: Stream container stdout and stderr live over WebSockets for instant debugging.
- 🛡️ **Role & Access Management**: Inspect database users, privileges, access control policies, functions, triggers, and extensions.
- 🔒 **100% Local & Offline**: All databases run strictly on your local machine via Docker—zero cloud lock-in, zero external data latency.

---

## 🛠️ Requirements & Prerequisites

Before running DockerDB, ensure you have the following tools installed and running on your system:

| Tool | Required Version | Description |
| :--- | :--- | :--- |
| 🐳 **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** | Latest | Must be running to manage and launch containers |
| 🐹 **[Go](https://go.dev/dl/)** | `v1.22+` | Powers the backend container orchestration & API server |
| 🟢 **[Node.js](https://nodejs.org)** | `v18+` | Powers the Next.js modern web dashboard |

---

## 🚀 Easy Step-by-Step Guide (How to Use Perfectly)

Follow these easy steps to get DockerDB up and running on your local setup in under 2 minutes:

### Step 1 — Clone the Repository

```bash
git clone https://github.com/soumikk01/DockerDB.git
cd DockerDB
```

---

### Step 2 — Start the Go Backend Server

Open a terminal window and launch the Go backend API service:

```bash
cd backend
go run ./cmd/server
```

> **Expected Console Output:**
> ```text
> [docker] Connected to Docker Desktop via named pipe
> [main] DockerDB backend listening on http://localhost:8080
> ```

---

### Step 3 — Start the Next.js Frontend Dashboard

Open a **second terminal window** in the project root directory and run:

```bash
# From the project root (DockerDB/)
npm install
npm run dev
```

---

### Step 4 — Open the DockerDB Dashboard

Open your web browser and navigate to:

👉 **[http://localhost:3000](http://localhost:3000)**

---

### Step 5 — Launch & Connect to Your Database

1. Click **Get Started** on the homepage.
2. Select your desired engine (e.g., **PostgreSQL**).
3. DockerDB will automatically pull the container image (first time only) and boot up the container.
4. Copy the generated `DATABASE_URL` from the workspace header or the **Database Management** panel.
5. Paste it directly into your application's `.env` file:

```env
# Example .env configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dockerdb"
```

---

### Step 6 — Query, Inspect, and Monitor

From the DockerDB Workspace, you can:
- **Execute Queries**: Run SQL statements and view real-time data output.
- **Inspect Schemas**: Navigate through tables, columns, indexes, and triggers.
- **Watch Live Logs**: Track container status and query performance via the integrated WebSocket log viewer.

---

## 🗄️ Supported Database Engines

DockerDB comes pre-configured with popular database engines:

| Engine | Image Tag | Default Port | Default Credentials |
| :--- | :--- | :--- | :--- |
| **PostgreSQL** | `postgres:16-alpine` | `5432` | `postgres` / `postgres` |
| **MySQL** | `mysql:8.0` | `3306` | `root` / `root` |
| **MongoDB** | `mongo:7.0` | `27017` | `root` / `example` |
| **Redis** | `redis:7-alpine` | `6379` | *No password required* |

---

## 🏗️ Architecture & Project Structure

DockerDB follows a clean decoupled architecture combining a high-performance Go backend with a responsive Next.js frontend dashboard:

```text
DockerDB/
├── backend/                  # Go Backend API (Gin Framework + Docker SDK + SQLite)
│   ├── cmd/server/           # Application entry point
│   ├── internal/             # Core business services
│   │   ├── database/         # Database metadata & SQLite storage
│   │   ├── docker/           # Docker API orchestration client
│   │   ├── query/            # SQL execution engine
│   │   ├── schema/           # Database schema & table introspector
│   │   └── ws/               # WebSocket log streaming handler
│   └── pkg/                  # Shared utilities (config, DB connection pool)
│
├── src/                      # Next.js Frontend Dashboard (React 19 + SCSS)
│   ├── app/                  # App Router pages (Home, Database Selection, Workspace)
│   ├── components/           # UI components & interactive workspace panels
│   ├── lib/api.ts            # Typed REST & WebSocket client
│   └── styles/               # SCSS & design tokens
│
└── public/                   # Static assets & app logo
    └── logo.svg
```

---

## 🔌 API & WebSocket Reference

The Go backend exposes a clean REST API and WebSocket interface:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/databases` | Fetch list of active and stored databases |
| `POST` | `/api/v1/databases` | Provision a new database container instance |
| `GET` | `/api/v1/databases/:id` | Get status and details of a specific database |
| `DELETE` | `/api/v1/databases/:id` | Stop and remove container instance |
| `GET` | `/api/v1/databases/:id/connect` | Retrieve connection strings and ORM snippets |
| `POST` | `/api/v1/databases/:id/query` | Execute raw database query |
| `GET` | `/api/v1/databases/:id/schema` | Fetch database schema, tables, and relations |
| `WS` | `/ws/databases/:id/logs` | Real-time container log stream (WebSocket) |

---

## 💡 Troubleshooting & FAQs

<details>
<summary><b>Docker Desktop is not recognized or backend fails to start?</b></summary>

Make sure Docker Desktop is open and running in your system tray before launching the Go backend. On Windows, DockerDB communicates with Docker via standard named pipes.
</details>

<details>
<summary><b>Port conflict error when creating a container?</b></summary>

If port `5432`, `3306`, or `27017` is already bound by a local service (like a local Postgres installation), DockerDB allows specifying custom port mappings in database creation options.
</details>

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<p align="center">
  Crafted with ❤️ for developers who love clean, fast local development.
</p>
