import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase', // className={styles.myClass}
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
   // preprocessorOptions: {
    //   scss: {
     // additionalData: `@import "@/styles/variables.scss";`  // ✅ Это добавит импорт во ВСЕ файлы, КРОМЕ самого variables.scss
   // }
    //}
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    host: true,
    port: 80,
    proxy: {
      '/api': {
        target: 'http://backend:3001',
        changeOrigin: true
      }
    }
  }
});