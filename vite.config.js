import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const proxyFGF = {
  '/fgf': {
    target: 'https://fgf.com.br',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/fgf/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: false,
    proxy: proxyFGF,
  },
  preview: {
    proxy: proxyFGF,
  },
});
