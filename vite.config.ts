import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for Locality Delivers
export default defineConfig({
  plugins: [react()],
  define: {
    // Bridges environment variables from the build process to the browser
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env': process.env
  },
  server: {
    port: 3000
  }
});
