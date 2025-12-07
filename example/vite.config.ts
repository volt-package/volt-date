import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'volt-date': path.resolve(__dirname, '../dist/index.esm.js'),
      'volt-date/plugins': path.resolve(__dirname, '../dist/plugins/index.esm.js'),
    },
  },
});
