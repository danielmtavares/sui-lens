#!/usr/bin/env node

import { pathToFileURL } from "node:url";

import { Command } from "commander";

import packageJson from "../package.json" with { type: "json" };
import { registerCommands } from "./commands/index.js";
import { reportErrorToStderr } from "./utils/errors.js";

export function createCli(): Command {
  const program = new Command();

  program
    .name("sui-lens")
    .description(
      "Inspect Sui addresses, objects, transactions, and packages from the terminal.\n\nExamples:\n  sui-lens address 0x... --format table\n  sui-lens tx <digest> --json\n  sui-lens package 0x... --network testnet",
    )
    .version(packageJson.version)
    .showHelpAfterError()
    .showSuggestionAfterError();

  registerCommands(program);

  return program;
}

export async function runCli(argv: readonly string[] = process.argv): Promise<void> {
  try {
    await createCli().parseAsync(argv);
  } catch (err) {
    process.exitCode = reportErrorToStderr(err);
  }
}

function isExecutedDirectly(): boolean {
  const entryPath = process.argv[1];

  if (entryPath === undefined) {
    return false;
  }

  return import.meta.url === pathToFileURL(entryPath).href;
}

if (isExecutedDirectly()) {
  await runCli();
}
