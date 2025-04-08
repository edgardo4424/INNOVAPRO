import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo (`development` o `production`)
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    base: '/', // 👈 Asegúrate que esté bien según la ruta donde se alojará el frontend
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV), // opcional: útil si manejas múltiples entornos
    },
  }
})