import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 120000, // 2 minutes
  use: {
    headless: true,
  },
});
