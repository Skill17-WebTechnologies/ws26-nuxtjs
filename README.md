# Nuxt 4.3.1 — WSC2026

A small, real **Nuxt** application (version **4.3.1**), part of the WorldSkills 2026
Web Technologies (TP17) set. Runtime pinned to the competition spec.

## Run it

```bash
docker compose up --build
```

Then open **http://localhost**. This starts the app's dev server inside Docker — no local
toolchain required.

Stop it with `docker compose down`.

## Develop

For a hot-reloading loop on your machine you need **Node 24.1.0** and **npm 11.5.0** installed locally (the same versions the Docker image pins).

```bash
npm install
npx prisma db push   # creates prisma/dev.db and generates the client
npm run dev
```

The dev server runs on **http://localhost** and reloads on save.
Edit **app/app.vue** to change the app.

## Database

The task list is stored in a self-contained **SQLite** file — there is no database
server in any environment. The schema is `prisma/schema.prisma`; the connection string
comes from `DATABASE_URL` (default `file:./prisma/dev.db`), wired up in `prisma.config.ts`.

`server/utils/prisma.ts` creates the client (cached on `globalThis` so dev hot reloads
reuse one connection) and is auto-imported by `server/api/tasks.get.ts`. `app/app.vue`
reads that route with `useFetch`, so the list is rendered server-side.

Change the schema, then re-sync with:

```bash
npx prisma db push
```

## Stack

- Node 24.1.0 / npm 11.5.0
- Nuxt 4.3.1
- Prisma 7.3.0 (`@prisma/adapter-better-sqlite3`)
