import { execFile } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import { promisify } from "node:util";

const executeFile = promisify(execFile);
const packageMetadata = JSON.parse(
  await readFile(new URL("../packages/core/package.json", import.meta.url)),
);
const packageSpecifier = `${packageMetadata.name}@${packageMetadata.version}`;
let shouldPublish = false;

try {
  await executeFile("npm", ["view", packageSpecifier, "version", "--json"], {
    timeout: 30_000,
  });
} catch (error) {
  const output = `${error.stdout ?? ""}\n${error.stderr ?? ""}`;

  if (error.code === 1 && output.includes("E404")) {
    shouldPublish = true;
  } else {
    throw error;
  }
}

const result = [
  `package=${packageMetadata.name}`,
  `version=${packageMetadata.version}`,
  `should-publish=${shouldPublish}`,
].join("\n");

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `${result}\n`);
}

console.log(
  shouldPublish
    ? `${packageSpecifier} is ready to publish.`
    : `${packageSpecifier} is already published.`,
);
