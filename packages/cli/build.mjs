import { chmod, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const outfile = fileURLToPath(new URL("../core/dist/cli.js", import.meta.url));

await mkdir(dirname(outfile), { recursive: true });
await build({
  entryPoints: [fileURLToPath(new URL("src/cli.js", import.meta.url))],
  outfile,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node22",
});
await chmod(outfile, 0o755);
