import { defineConfig, devices } from '@playwright/test';
import { env } from './src/utils/env';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const tagsFilterPattern = env.tagsFilter.length
  ? new RegExp(env.tagsFilter.map(escapeRegExp).join('|'))
  : undefined;

const chromiumUse = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  ? {
      ...devices['Desktop Chrome'],
      launchOptions: {
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      },
    }
  : { ...devices['Desktop Chrome'] };

export default defineConfig({
  testDir: './tests',
  grep: tagsFilterPattern,
  workers: 2,
  timeout: 120000,
  expect: {
    timeout: 30000,
  },

  use: {
    baseURL: env.baseUrl,
    actionTimeout: 30000,
    headless: true,
    trace: process.env.CI ? 'retain-on-failure' : 'off',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'off' : 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: chromiumUse,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright'],
  ],
});
