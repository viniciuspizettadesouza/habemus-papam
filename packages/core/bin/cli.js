#!/usr/bin/env node
import { runCli } from "./commands.js";

const result = runCli(process.argv.slice(2));

if (result.output) {
  console.log(result.output);
}

if (result.error) {
  console.error(result.error);
}

process.exitCode = result.exitCode;
