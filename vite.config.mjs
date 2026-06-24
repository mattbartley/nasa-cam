import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `envPrefix` keeps the existing REACT_APP_* variable names working (now read
// via import.meta.env), so no Vercel env config has to change. Output goes to
// build/ to match the existing Vercel `outputDirectory`.
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind to the Tailscale IP only, so the dev server stays on the tailnet and
    // is NOT exposed on the VPS public interface. Override with VITE_DEV_HOST
    // (e.g. `localhost` or `true`) when running on another machine.
    host: process.env.VITE_DEV_HOST || '100.115.160.86',
    port: 3000,
    // Vite blocks requests whose Host header isn't allowed (DNS-rebinding
    // protection). Restrict to Tailscale MagicDNS names (*.ts.net); direct IP
    // access is permitted by default. Without this, *.ts.net hostnames return
    // "Blocked request. This host is not allowed."
    allowedHosts: ['.ts.net'],
    // HMR over direct remote access works against the same host/port the page
    // was loaded from, so no extra hmr config is needed for IP/tailnet use.
  },
  // Same tailnet-only settings for `vite preview` (serving the built app).
  preview: {
    host: process.env.VITE_DEV_HOST || '100.115.160.86',
    port: 4173,
    allowedHosts: ['.ts.net'],
  },
  build: { outDir: 'build' },
  envPrefix: ['VITE_', 'REACT_APP_'],
});
