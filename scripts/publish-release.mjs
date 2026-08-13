import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const executeFile = promisify(execFile);
const packageDirectory = fileURLToPath(
  new URL("../packages/core/", import.meta.url),
);
const packageMetadata = JSON.parse(
  await readFile(new URL("../packages/core/package.json", import.meta.url)),
);

try {
  const result = await executeFile("npm", ["publish", "--access", "public"], {
    cwd: packageDirectory,
    maxBuffer: 10 * 1024 * 1024,
  });

  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  console.log(`Published ${packageMetadata.name}@${packageMetadata.version}.`);
} catch (error) {
  if (error.stdout) {
    process.stdout.write(error.stdout);
  }

  if (error.stderr) {
    process.stderr.write(error.stderr);
  }

  throw error;
}
