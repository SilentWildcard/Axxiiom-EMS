import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base './' guarantees assets load correctly on GitHub Pages under any repo name
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
  },
});
