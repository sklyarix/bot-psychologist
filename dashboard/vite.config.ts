import tailwindcss from '@tailwindcss/vite'
import tanstackRouter from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true
		}),
		react(),
		tailwindcss()
	],
build: {
    outDir: '/var/www/dashboard', // <-- директория для сборки
    emptyOutDir: true, // очищает старые файлы перед новой сборкой
  },
	server: {
		host: 'localhost',
		port: 5174,
		strictPort: true, // если порт занят — не прыгать на другой
		open: '/' // открыть браузер на /
	}
})
