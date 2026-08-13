import { execFile } from "node:child_process";
import { rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execute = promisify(execFile);
const outputDirectory = fileURLToPath(new URL("dist/", import.meta.url));
const project = fileURLToPath(new URL("tsconfig.json", import.meta.url));
const compiler = join(
  dirname(fileURLToPath(import.meta.resolve("typescript/package.json"))),
  "bin",
  "tsc",
);

await rm(outputDirectory, { recursive: true, force: true });

try {
  await execute(process.execPath, [compiler, "--project", project]);
} catch (error) {
  if (error.stdout) {
    process.stdout.write(error.stdout);
  }

  if (error.stderr) {
    process.stderr.write(error.stderr);
  }

  throw error;
}
