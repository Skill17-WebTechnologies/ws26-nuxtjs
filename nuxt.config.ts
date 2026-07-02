export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  // allow the WSC2026 ingress hosts (*.skill17.com) through the Vite dev server
  vite: {
    server: {
      allowedHosts: ['.skill17.com'],
    },
  },
})
