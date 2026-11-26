import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA(
        {
              strategies: "injectManifest",
              srcDir : "src",
              filename : "sw.js",
              manifest : false,
              injectRegister : false,
              registerType : "prompt",
              injectManifest: {
                 globPatterns: [
                    "**/*.{js,css,html,png,svg,ico,json}"]
        },
      }),
  ],
  base: '/React/practice8/'
})
