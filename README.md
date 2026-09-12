# Nuxt 4.3.1 — WSC2026

A small, real **Nuxt** application (version **4.3.1**), part of the WorldSkills 2026
Web Technologies (TP17) set. Runtime pinned to the competition spec.

## Configuration

The app needs one environment variable, a MySQL connection string:

| File | Used for | In git? |
|------|----------|---------|
| `.env` | your local development database | No — gitignored |
| `.env.prod` | the deployed app; the platform fills in your credentials | Yes |

```bash
cp .env.example .env
```

`docker-entrypoint.sh` copies `.env.prod` over `.env` when the container starts, so the
deployed app always runs against the deployed configuration. Nothing is hardcoded:
`server/utils/prisma.ts`, the `Dockerfile` and `docker-compose.yml` contain no host, user
or password, and Compose starts the local MySQL server from the same `.env` the app reads.

## Run it

```bash
cp .env.example .env
docker compose up --build
```

Then open **http://localhost**. This starts the app's dev server inside Docker — no local
toolchain required.

Stop it with `docker compose down`.

## Develop

For a hot-reloading loop on your machine you need **Node 24.1.0** and **npm 11.5.0** installed locally (the same versions the Docker image pins).

```bash
cp .env.example .env
npm install
npm run db:migrate    # applies prisma/migrations to the database
npx prisma generate   # generates the client into node_modules
npm run dev
```

`docker compose up` starts a MySQL server for you; running outside Docker needs a MySQL
server of your own, with `DATABASE_URL` pointed at it.

The dev server runs on **http://localhost** and reloads on save.
Edit **app/app.vue** to change the app.

## Checking the connection

```bash
curl -fsS http://localhost/api/db-check
```

```json
{ "ok": true, "driver": "mysql", "host": "db", "port": 3306, "database": "app",
  "user": "app", "server_version": "8.4.11", "latency_ms": 3,
  "demo_table": "nuxt_tasks present" }
```

It returns **503** when the connection fails, naming the host, database and user it tried
and the driver's error code — `ER_ACCESS_DENIED_ERROR` for a wrong password, `ENOTFOUND`
for a wrong host. The password is never in the response. Every WSC2026 template answers
the same check, so one command works whatever stack you chose.

The check talks to MySQL through the `mariadb` driver rather than Prisma, because Prisma
reports every connection problem as the same ten-second pool timeout. Whether Prisma
itself works is answered by `/api/tasks`.

## Database

Tasks live in **MySQL** in a table named **`nuxt_tasks`**. The schema is
`prisma/schema.prisma`; the connection string comes from `DATABASE_URL`, wired up in
`prisma.config.ts`.

`server/utils/prisma.ts` creates the client (cached on `globalThis` so dev hot reloads
reuse one connection pool) and is auto-imported by `server/api/tasks.get.ts`. `app/app.vue`
reads that route with `useFetch`, so the list is rendered server-side.

### ⚠️ The database is shared

Every project you create points at the **same** MySQL database, so it already contains
other projects' tables.

1. **Never run `prisma db push` or `prisma migrate dev` against it.** Both diff the whole
   database against `schema.prisma` and **drop every table they do not know about** — that
   is another project's data. `db:push` is deliberately absent from `package.json`.
2. Tables are **prefixed** with `@@map()` so they cannot collide. Rename the prefix per
   project; do not remove it.

Schema changes ship as create-only migration files under `prisma/migrations/` and are
applied with `prisma migrate deploy`, which never computes a destructive diff. On first
boot against a database that already holds other tables Prisma reports `P3005`; the
entrypoint baselines it automatically.

## Stack

- Node 24.1.0 / npm 11.5.0
- Nuxt 4.3.1
- Prisma 7.3.0 (`@prisma/adapter-mariadb`, MySQL driver adapter)
- `mariadb` 3.4.5 — the driver, used directly by `/api/db-check` for precise errors
- MySQL 8.4 (started by `docker compose`)
