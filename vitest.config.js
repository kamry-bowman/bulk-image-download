import { defineConfig } from "vitest/config";

export default defineConfig({
    printConsoleTrace: true,
    test: {
        printConsoleTrace: true,
        browser: {
            enabled: true,
            provider: "playwright",
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
        },
    },
});
