// getTasks / ensureSeeded are auto-imported from server/utils/prisma.ts
export default defineEventHandler(async (event) => {
  await ensureSeeded()
  const tasks = await getTasks()
  if (!tasks) {
    setResponseStatus(event, 503)
    return { framework: 'Nuxt', version: '4.3.1', error: 'database unavailable' }
  }
  return { framework: 'Nuxt', version: '4.3.1', orm: 'Prisma 7.3.0', tasks }
})
