import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Local dev/preview chạy tại '/' cho tiện kiểm tra.
// Khi deploy GitHub Pages, CI set BASE_PATH=/<tên-repo>/ qua env.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [tailwindcss()],
});
