import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify("AIzaSyDI6Lg-lFqpU6yERUAmJh8OfOCR-b3mR8s")
  },
  server: {
    port: 3000
  }
});
