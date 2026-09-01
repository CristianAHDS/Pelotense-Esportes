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

const proxyUOL = {
  '/uol': {
    target: 'https://www.uol.com.br',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/uol/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: false,
    proxy: { ...proxyFGF, ...proxyUOL },
  },
  preview: {
    proxy: { ...proxyFGF, ...proxyUOL },
  },
});
