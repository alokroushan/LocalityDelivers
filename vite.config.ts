import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify("AIzaSyDnl1hq6UX8OQxzDFJs8Ft24NZ3amQJmkU")
  },
  server: {
    port: 3000
  }
});
