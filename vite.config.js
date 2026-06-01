import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  output: {
    assetPrefix: "https://khftl.github.io/exchange-react",
  },
})
