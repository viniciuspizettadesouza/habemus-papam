import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "habemus-papam": fileURLToPath(
        new URL("../core/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/commands.js"],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
