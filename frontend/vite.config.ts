import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Use WASM rollup to bypass Application Control policy blocking native .node binaries
// @rollup/wasm-node is the pure-JS/WASM alternative that doesn't require native modules
export default defineConfig({
  plugins: [react()],
})
