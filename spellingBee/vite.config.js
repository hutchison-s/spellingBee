import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://beeyondwords.vercel.app',
  //       changeOrigin: true
  //     },
  //     '/users': {
  //       target: 'https://beeyondwords.vercel.app',
  //       changeOrigin: true
  //     }
  //   }
  // }
})
