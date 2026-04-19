import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import https from 'node:https';

const backendUrl = process.env.VITE_BACKEND_URL || 'https://genai-capstone-1.onrender.com';

export default defineConfig({
  plugins: [react(), apiDevProxy()],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'react';
          if (id.includes('/gsap/') || id.includes('/framer-motion/')) return 'animation';
          if (id.includes('/recharts/')) return 'charts';
          if (id.includes('/three/')) return 'three';
          if (
            id.includes('/react-hook-form/')
            || id.includes('/@hookform/')
            || id.includes('/zod/')
          ) {
            return 'forms';
          }
          return 'vendor';
        },
      },
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});

function apiDevProxy() {
  return {
    name: 'agrimind-api-dev-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', (req, res) => {
        const cleanPath = (req.url || '/').replace(/^\/api/, '') || '/';
        const target = new URL(cleanPath, backendUrl);
        const proxyReq = https.request(
          target,
          {
            method: req.method,
            headers: {
              ...req.headers,
              host: target.host,
              origin: backendUrl,
            },
            timeout: 130000,
          },
          (proxyRes) => {
            res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
            proxyRes.pipe(res);
          },
        );

        proxyReq.on('error', (error) => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ detail: error.message }));
        });

        req.pipe(proxyReq);
      });
    },
  };
}
