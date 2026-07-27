import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) return "react"
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/motion-dom")) return "motion"
          if (id.includes("node_modules/gsap") || id.includes("node_modules/lenis")) return "animation"
        },
      },
    },
  },
})
