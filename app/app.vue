<script setup>
const count = ref(0)
useHead({ title: 'WSC2026 · Nuxt 4.3.1' })

// Fetched during SSR, so the task list is in the server-rendered HTML.
const { data } = await useFetch('/api/tasks')
</script>

<template>
  <main class="card">
    <h1>Nuxt <span class="v">4.3.1</span></h1>
    <p>WSC2026 Web Technologies — minimal Nuxt app, tasks read from SQLite with Prisma 7.3.0.</p>
    <ul v-if="data?.tasks">
      <li v-for="task in data.tasks" :key="task.id">
        {{ task.done ? '✅' : '⬜️' }} {{ task.title }}
      </li>
    </ul>
    <p v-else>⚠️ Database not available. Start with <code>docker compose up --build</code>.</p>
    <p>JSON: <code>GET /api/tasks</code></p>
    <button @click="count++">Clicked {{ count }} times</button>
  </main>
</template>

<style>
:root { color-scheme: dark; }
body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0b1020; color: #e7ecff; }
.card { background: #151c33; padding: 2.5rem 3rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,.4); }
.v { color: #00dc82; }
ul { line-height: 1.9; padding-left: 1.2rem; }
code { background: #0b1020; padding: .15rem .4rem; border-radius: 6px; }
button { font-size: 1rem; padding: .6rem 1.2rem; border-radius: 8px; border: 0; background: #00dc82; color: #0b1020; font-weight: 600; cursor: pointer; }
</style>
