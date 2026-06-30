<script setup>
const count = ref(0)
useHead({ title: 'WSC2026 · Nuxt 4.3.1' })
</script>

<template>
  <main class="card">
    <h1>Nuxt <span class="v">4.3.1</span></h1>
    <p>WSC2026 Web Technologies — minimal Nuxt app.</p>
    <button @click="count++">Clicked {{ count }} times</button>
  </main>
</template>

<style>
:root { color-scheme: dark; }
body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0b1020; color: #e7ecff; }
.card { background: #151c33; padding: 2.5rem 3rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,.4); }
.v { color: #00dc82; }
button { font-size: 1rem; padding: .6rem 1.2rem; border-radius: 8px; border: 0; background: #00dc82; color: #0b1020; font-weight: 600; cursor: pointer; }
</style>
