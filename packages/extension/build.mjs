import { copyFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const outputDirectory = fileURLToPath(new URL("dist/", import.meta.url));

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await build({
  entryPoints: [fileURLToPath(new URL("src/popup.js", import.meta.url))],
  outfile: fileURLToPath(new URL("dist/popup.js", import.meta.url)),
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "chrome120",
});

await Promise.all(
  ["icon.png", "manifest.json", "popup.html"].map((filename) =>
    copyFile(
      new URL(filename, import.meta.url),
      new URL(`dist/${filename}`, import.meta.url),
    ),
  ),
);
