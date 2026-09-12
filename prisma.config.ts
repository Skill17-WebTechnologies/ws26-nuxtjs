import { defineConfig } from 'prisma/config'

// Prisma 7's CLI does not read .env on its own — without this every prisma
// command fails with "datasource.url property is required" even when .env is
// correct. In Docker and Kubernetes DATABASE_URL comes from the environment.
try {
  process.loadEnvFile()
} catch {
  // no .env present — expected outside local development
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // MySQL over TCP. The real value comes from DATABASE_URL — set in .env
    // locally, and written into .env.prod by the competition platform when the
    // repository is created. There is deliberately no usable fallback: a
    // template that quietly connects somewhere else when configuration is
    // missing looks healthy while running against the wrong data.
    //
    // The placeholder exists so `prisma generate` can run during the Docker
    // build, before any credentials exist. It is never a usable server: if you
    // see `placeholder` in a runtime error, DATABASE_URL did not reach the
    // process — /api/db-check says so in as many words.
    url: process.env.DATABASE_URL || 'mysql://placeholder:placeholder@placeholder:3306/placeholder',
  },
})
