import { defineConfig, mergeConfig } from 'vite';
import { tanstackViteConfig } from '@tanstack/config/vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

const customConfig = defineConfig({
  plugins: [
    dts({
      outDir: 'dist',
      entryRoot: 'src',
      tsconfigPath: './tsconfig.json'
    })
  ],
  resolve: {
    alias: {
      "@acoboyz/react-qstate": resolve(__dirname, "./src/index.ts"),
    }
  },
});

export default mergeConfig(
  customConfig,
  tanstackViteConfig({
    entry: './src/index.ts',
    srcDir: './src',
  })
);
