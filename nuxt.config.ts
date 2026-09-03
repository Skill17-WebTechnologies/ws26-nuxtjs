import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  // allow the WSC2026 ingress hosts (*.skill17.com) through the Vite dev server
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['.skill17.com'],
    },
  },
})
