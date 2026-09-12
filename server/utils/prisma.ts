import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// MySQL over the network. DATABASE_URL is the only source of the connection —
// set in .env locally, written into .env.prod by the competition platform for
// the deployed app, and never hardcoded here. The entrypoint runs
// `prisma migrate deploy` against it before the server starts.
//
// There is deliberately no fallback: a template that quietly connects somewhere
// else when configuration is missing looks healthy while running against the
// wrong data. /api/db-check reports a missing value in as many words.
function createClient() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set — see .env.example')
  // The adapter accepts a mysql:// URL and rewrites it to mariadb:// internally.
  const adapter = new PrismaMariaDb(url)
  return new PrismaClient({ adapter })
}

// `nuxt dev` re-evaluates server modules on hot reload; cache the client on globalThis so
// each reload does not open another connection pool to MySQL.
const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma || createClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getTasks() {
  try {
    return await prisma.task.findMany({ orderBy: { id: 'asc' } })
  } catch (e) {
    return null // database unavailable
  }
}

// Seed once per process, not once per request.
let seeding: Promise<void> | undefined
export function ensureSeeded() {
  return (seeding ??= seed())
}

async function seed() {
  try {
    if ((await prisma.task.count()) === 0) {
      await prisma.task.createMany({
        data: [
          { title: 'Define the schema', done: true },
          { title: 'Run prisma migrate deploy', done: true },
          { title: 'Query from a Nitro route', done: false },
        ],
      })
    }
  } catch (e: any) {
    console.error('seed skipped (database not ready):', e.message)
  }
}
