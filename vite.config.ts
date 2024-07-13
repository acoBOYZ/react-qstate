import { defineConfig, mergeConfig } from 'vite';
import { tanstackViteConfig } from '@tanstack/config/vite';

const customConfig = defineConfig({});

export default mergeConfig(
  customConfig,
  tanstackViteConfig({
    entry: './src/index.ts',
    srcDir: './src',
  })
);
