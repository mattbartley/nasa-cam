import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `envPrefix` keeps the existing REACT_APP_* variable names working (now read
// via import.meta.env), so no Vercel env config has to change. Output goes to
// build/ to match the existing Vercel `outputDirectory`.
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind all interfaces (0.0.0.0 / ::) so the dev server is reachable over the
    // VPS IP and Tailscale, not just localhost.
    host: true,
    port: 3000,
    // Vite blocks requests whose Host header isn't allowed (DNS-rebinding
    // protection). Plain IP access is permitted by default, but Tailscale
    // MagicDNS hostnames (*.ts.net) are not — without this they return
    // "Blocked request. This host is not allowed." `true` accepts any Host;
    // tighten to e.g. ['.ts.net'] to restrict it to the tailnet.
    allowedHosts: true,
    // HMR over direct remote access works against the same host/port the page
    // was loaded from, so no extra hmr config is needed for IP/tailnet use.
  },
  // Same remote-access settings for `vite preview` (serving the built app).
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
  build: { outDir: 'build' },
  envPrefix: ['VITE_', 'REACT_APP_'],
});
