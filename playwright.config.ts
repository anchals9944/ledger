import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  snapshotDir: "tests/e2e/__screenshots__",
  webServer: { command: "npm run dev -- --port 5173", url: "http://localhost:5173", reuseExistingServer: true },
  use: { baseURL: "http://localhost:5173" },
  projects: [
    { name: "mobile", use: { ...devices["iPhone 14"], viewport: { width: 390, height: 844 } } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
  ],
});
