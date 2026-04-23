import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        week0: resolve(__dirname, 'src/week0/index.html'),
        week1: resolve(__dirname, 'src/week1/index.html'),
        week2: resolve(__dirname, 'src/week2/index.html'),
        week3: resolve(__dirname, 'src/week3/index.html'),
        week4: resolve(__dirname, 'src/week4/index.html'),
        week5: resolve(__dirname, 'src/week5/index.html'),
        week6: resolve(__dirname, 'src/week6/index.html'),
        'week6-bonus': resolve(__dirname, 'src/week6-bonus/index.html'),
        week7: resolve(__dirname, 'src/week7/index.html'),
        week8: resolve(__dirname, 'src/week8/index.html'),
        week9: resolve(__dirname, 'src/week9/index.html'),
        week10: resolve(__dirname, 'src/week10/index.html'),
      },
    },
  },
});
