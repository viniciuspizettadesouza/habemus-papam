import eslint from "@eslint/js";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  {
    ignores: [
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
      "*.tgz",
      "*.zip",
    ],
  },
  eslint.configs.recommended,
  typescriptEslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["packages/extension/src/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
);
