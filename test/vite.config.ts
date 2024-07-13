import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@acoboyz/react-qstate": resolve(__dirname, "../src/index.ts"),
    }
  }
});
