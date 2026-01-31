import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
        server: {
        port: 3000, // aqui você escolhe a porta
        host: true  // opcional, para acessar pela rede
      },

      },
    }),
  ],
})
