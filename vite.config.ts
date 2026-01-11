import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for Locality Delivers
export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the browser to access the API_KEY from the environment
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    port: 3000
  }
});
