import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `envPrefix` keeps the existing REACT_APP_* variable names working (now read
// via import.meta.env), so no Vercel env config has to change. Output goes to
// build/ to match the existing Vercel `outputDirectory`.
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: { outDir: 'build' },
  envPrefix: ['VITE_', 'REACT_APP_'],
});
