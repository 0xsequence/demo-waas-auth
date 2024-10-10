import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

//import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    //mkcert({ hosts: ['localhost.direct'] }),
    react(),
    vanillaExtractPlugin({}),
    nodePolyfills({
      globals: {
        Buffer: true // can also be 'build', 'dev', or false
        // global: true,
        // process: true,
      }
    })
  ],
  server: {
    port: 4444
  }
}))
