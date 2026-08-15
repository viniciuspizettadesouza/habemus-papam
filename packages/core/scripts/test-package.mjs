import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const executeFile = promisify(execFile);
const packageDirectory = fileURLToPath(new URL("../", import.meta.url));
const packageMetadata = JSON.parse(
  await readFile(join(packageDirectory, "package.json"), "utf8"),
);
const compiler = join(
  dirname(fileURLToPath(import.meta.resolve("typescript/package.json"))),
  "bin",
  "tsc",
);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const temporaryDirectory = await mkdtemp(
  join(tmpdir(), "habemus-papam-package-"),
);
const tarball = join(
  temporaryDirectory,
  `${packageMetadata.name}-${packageMetadata.version}.tgz`,
);

async function execute(command, arguments_, options = {}) {
  try {
    return await executeFile(command, arguments_, {
      maxBuffer: 10 * 1024 * 1024,
      ...options,
    });
  } catch (error) {
    if (error.stdout) {
      process.stdout.write(error.stdout);
    }

    if (error.stderr) {
      process.stderr.write(error.stderr);
    }

    throw error;
  }
}

async function assertExists(path) {
  await access(path);
}

async function assertMissing(path) {
  try {
    await access(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }

    throw error;
  }

  throw new Error(`Unexpected published path: ${path}`);
}

try {
  const isolatedEnvironment = {
    ...process.env,
    npm_config_cache: join(temporaryDirectory, "npm-cache"),
  };

  await execute(
    npmCommand,
    ["pack", "--pack-destination", temporaryDirectory],
    { cwd: packageDirectory, env: isolatedEnvironment },
  );

  await writeFile(
    join(temporaryDirectory, "package.json"),
    `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`,
  );
  await writeFile(
    join(temporaryDirectory, "consumer.mjs"),
    `import { getCurrentPope } from "habemus-papam";
import metadata from "habemus-papam/package.json" with { type: "json" };

const pope = getCurrentPope();

if (pope.id !== "leo-xiv" || metadata.version !== "${packageMetadata.version}") {
  throw new Error("The installed package returned unexpected metadata.");
}

try {
  await import("habemus-papam/src/popes.js");
  throw new Error("An internal deep import unexpectedly resolved.");
} catch (error) {
  if (error.code !== "ERR_PACKAGE_PATH_NOT_EXPORTED") {
    throw error;
  }
}
`,
  );
  await writeFile(
    join(temporaryDirectory, "consumer.ts"),
    `import {
  getCurrentPope,
  getPontificateDuration,
  type Pope,
  type PontificateDuration,
} from "habemus-papam";

const pope: Pope = getCurrentPope();
const duration: PontificateDuration = getPontificateDuration(
  pope,
  "2026-05-08",
);

void duration;
`,
  );
  await writeFile(
    join(temporaryDirectory, "cli-consumer.mjs"),
    `import { writeFile } from "node:fs/promises";

let output = "";
console.log = (value) => {
  output += String(value);
};
const cliArguments = JSON.parse(process.env.CLI_ARGUMENTS ?? '["--json"]');
const outputFile = process.env.CLI_OUTPUT_FILE ?? "cli-output.json";
process.argv = [process.execPath, "habemus-papam", ...cliArguments];

await import("./node_modules/habemus-papam/bin/cli.js");
await writeFile(new URL(outputFile, import.meta.url), output);
`,
  );
  await writeFile(
    join(temporaryDirectory, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          module: "NodeNext",
          moduleResolution: "NodeNext",
          noEmit: true,
          strict: true,
          target: "ES2022",
        },
        include: ["consumer.ts"],
      },
      null,
      2,
    )}\n`,
  );

  await execute(
    npmCommand,
    ["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball],
    { cwd: temporaryDirectory, env: isolatedEnvironment },
  );

  const installedPackage = join(
    temporaryDirectory,
    "node_modules",
    packageMetadata.name,
  );

  await Promise.all(
    [
      "CHANGELOG.md",
      "LICENSE",
      "README.md",
      "bin/cli.js",
      "dist/cli.js",
      "dist/index.d.ts",
      "dist/index.js",
      "package.json",
    ].map((path) => assertExists(join(installedPackage, path))),
  );
  await Promise.all(
    ["build.mjs", "scripts", "src", "tests", "tsconfig.json", "type-tests"].map(
      (path) => assertMissing(join(installedPackage, path)),
    ),
  );

  await execute(process.execPath, [join(temporaryDirectory, "consumer.mjs")]);
  await execute(process.execPath, [compiler, "--project", temporaryDirectory]);

  const executable = join(
    temporaryDirectory,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "habemus-papam.cmd" : "habemus-papam",
  );
  await assertExists(executable);

  await execute(
    process.execPath,
    [join(temporaryDirectory, "cli-consumer.mjs")],
    {
      env: {
        ...isolatedEnvironment,
        CLI_ARGUMENTS: JSON.stringify(["date", "2015-01-01", "--json"]),
        CLI_OUTPUT_FILE: "date-cli-output.json",
      },
    },
  );
  const dateOutput = JSON.parse(
    await readFile(join(temporaryDirectory, "date-cli-output.json"), "utf8"),
  );

  if (dateOutput.pope.id !== "francis") {
    throw new Error("The installed CLI date lookup returned unexpected data.");
  }

  await execute(
    process.execPath,
    [join(temporaryDirectory, "cli-consumer.mjs")],
    {
      env: {
        ...isolatedEnvironment,
        CLI_ARGUMENTS: JSON.stringify(["stats", "--json"]),
        CLI_OUTPUT_FILE: "stats-cli-output.json",
      },
    },
  );
  const statsOutput = JSON.parse(
    await readFile(join(temporaryDirectory, "stats-cli-output.json"), "utf8"),
  );

  if (
    statsOutput.longest.pope.id !== "john-paul-ii" ||
    statsOutput.average.sampleSize !== 5
  ) {
    throw new Error("The installed CLI statistics returned unexpected data.");
  }

  await execute(process.execPath, [
    join(temporaryDirectory, "cli-consumer.mjs"),
  ]);
  const cliOutput = JSON.parse(
    await readFile(join(temporaryDirectory, "cli-output.json"), "utf8"),
  );

  if (cliOutput.id !== "leo-xiv") {
    throw new Error("The installed CLI returned unexpected data.");
  }

  console.log("Packed npm package integration test passed.");
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
