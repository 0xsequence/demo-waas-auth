import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
//import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    //mkcert({ hosts: ['localhost.direct'] }),
    react(),
    vanillaExtractPlugin(),
  ],
  server: {
    port: 4444,
  },
}))
