import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), vanillaExtractPlugin()],
  // For github pages https://0xsequence.github.io/demo-waas-auth/
  base: mode === 'production' ? '/demo-waas-auth/' : '/',
}))
