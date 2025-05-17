import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 🔥 Cargar las variables del entorno correspondiente
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: '/', // ⚠️ Cambia si usas subcarpeta (ej: /erp/)
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
      // 👇 Inyectar manualmente TODAS las variables necesarias
      'import.meta.env': {
        VITE_API_URL_PROD: JSON.stringify(env.VITE_API_URL_PROD),
        VITE_SOCKET_URL: JSON.stringify(env.VITE_SOCKET_URL),
        VITE_SOCKET_PATH: JSON.stringify(env.VITE_SOCKET_PATH),
        VITE_FRONTEND_URL: JSON.stringify(env.VITE_FRONTEND_URL),
        VITE_RECAPTCHA_SITE_KEY: JSON.stringify(env.VITE_RECAPTCHA_SITE_KEY),
        VITE_RECAPTCHA_SECRET_KEY: JSON.stringify(env.VITE_RECAPTCHA_SECRET_KEY),
        NODE_ENV: JSON.stringify(mode),
      },
    },
  };
});