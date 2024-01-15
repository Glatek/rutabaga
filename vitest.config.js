/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    browser: {
      name: 'chromium',
      enabled: true,
      headless: true,
      provider: 'playwright'
    }
  },
});
