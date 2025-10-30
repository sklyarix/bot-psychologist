import tailwindcss from '@tailwindcss/vite';
import tanstackRouter from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

//const LAN = '172.16.1.40';
const PORT = 5173;

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
  server: {
    host: true, // 0.0.0.0 — доступен с телефона
    port: PORT,
    strictPort: true,
    //origin: `http://${LAN}:${PORT}`, // чтобы абсолютные URL указывали на LAN
    //allowedHosts: [LAN], // явное разрешение хоста
    hmr: {
      protocol: 'ws', // при http должен быть ws
      //host: LAN,
      //port: PORT,
      //clientPort: PORT, // важно для мобильного вебвью
    },
    cors: true,
  },
});
