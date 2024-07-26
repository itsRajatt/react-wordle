import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/nytimes': {
        target: 'https://www.nytimes.com/svc/wordle/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nytimes/, '')
      },
      '/api/dictionary': {
        target: 'https://api.dictionaryapi.dev/api/v2/entries/en/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dictionary/, '')
      },
    },
  }
});
