# Nuxt 4.3.1 — WSC2026 minimal app

```bash
docker compose up --build
```

Open **http://localhost** — a minimal Nuxt app (SSR page + counter).
JSON API: `GET /api/tasks`.

The task list is read from a self-contained **SQLite** file (`prisma/dev.db`) with
**Prisma 7.3.0** — no database server. The entrypoint runs `prisma db push` before
starting the app, which seeds three rows on first boot.

Pinned: Node 24.1.0 / npm 11.5.0, Nuxt 4.3.1, Prisma 7.3.0.
