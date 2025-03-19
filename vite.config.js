import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        minify: false,
        copyPublicDir: false,
        lib: {
            entry: ["lib/main.js"],
            fileName: "bulk-image-download",
            name: "bulk-image-download",
        },
        rollupOptions: {
            external: ["node:path", "node:url"],
        },
    },
});
