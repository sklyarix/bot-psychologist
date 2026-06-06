import tailwindcss from '@tailwindcss/vite';
import tanstackRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
  /*
  build: {
    outDir: '/var/www/ivpsycho-bot.ru', // <-- директория для сборки
    emptyOutDir: true, // очищает старые файлы перед новой сборкой
  },
  server: {
    host: true,
    allowedHosts: true,
  },
  */
});
