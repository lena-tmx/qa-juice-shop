import { defineConfig, devices } from "@playwright/test";
import { env } from "./src/utils/env";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const tagsFilterPattern = env.tagsFilter.length
  ? new RegExp(env.tagsFilter.map(escapeRegExp).join("|"))
  : undefined;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  grep: tagsFilterPattern,
  retries: 0,
  workers: 2,
  timeout: 120000,
  expect: {
    timeout: 30000,
  },

  use: {
    baseURL: env.baseUrl,
    actionTimeout: 30000,
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],

  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["allure-playwright"],
    ...(env.ci
      ? [
          [
            "blob",
            {
              outputDir:
                process.env.PLAYWRIGHT_BLOB_OUTPUT_DIR ?? "blob-report",
            },
          ] as const,
        ]
      : []),
    ...(env.ci ? [["json", { outputFile: "test-report.json" }] as const] : []),
    [
      "playwright-qase-reporter",
      {
        mode: process.env.QASE_MODE ?? "off",
        testops: {
          api: {
            token:
              process.env.QASE_TESTOPS_API_TOKEN ?? process.env.QASE_API_TOKEN,
          },
          project: process.env.QASE_TESTOPS_PROJECT ?? "ZEN",
          run: {
            id: process.env.QASE_TESTOPS_RUN_ID
              ? Number(process.env.QASE_TESTOPS_RUN_ID)
              : undefined,
            complete: process.env.QASE_TESTOPS_RUN_COMPLETE !== "false",
            title:
              process.env.QASE_TESTOPS_RUN_TITLE ?? "Local Playwright test run",
          },
          uploadAttachments: true,
        },
      },
    ],
  ],
});
