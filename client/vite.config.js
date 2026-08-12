import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    // Anything the app requests at /api/... gets forwarded to your Express
    // server on port 5000. This is why the frontend never needs to know the
    // backend's full URL, and why you get no CORS errors in development.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
