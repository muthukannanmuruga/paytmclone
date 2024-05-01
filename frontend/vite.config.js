import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })




export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true,
    host: true // Allows access from any host
  },
});
