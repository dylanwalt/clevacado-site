import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), {
      name: 'clevacado-live-dashboard',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/live/' || req.url === '/live/index.html') {
            res.setHeader('Content-Type', 'text/html');
            res.end(fs.readFileSync(path.resolve(__dirname, 'public/live/index.html')));
            return;
          }
          const pathname = req.url?.split('?')[0];
          if (pathname === '/mobile-app-walkthrough' || pathname === '/mobile-app-walkthrough/' || pathname === '/mobile-app-walkthrough/index.html') {
            res.setHeader('Content-Type', 'text/html');
            res.end(fs.readFileSync(path.resolve(__dirname, 'public/mobile-app-walkthrough/index.html')));
            return;
          }
          next();
        });
      },
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Keep HMR configurable for local development environments.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
