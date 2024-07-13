import { defineConfig, mergeConfig } from 'vite';
import { tanstackViteConfig } from '@tanstack/config/vite';
import dts from 'vite-plugin-dts';

const customConfig = defineConfig({
  plugins: [
    dts({
      outDir: 'dist',
      entryRoot: 'src',
      tsconfigPath: './tsconfig.json'
    })
  ]
});

export default mergeConfig(
  customConfig,
  tanstackViteConfig({
    entry: './src/index.ts',
    srcDir: './src',
  })
);
