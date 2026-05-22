#!/usr/bin/env node

import { pathToFileURL } from "node:url";

import { Command, CommanderError } from "commander";

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
    .exitOverride()
    .showHelpAfterError()
    .showSuggestionAfterError();

  registerCommands(program);

  return program;
}

export async function runCli(argv: readonly string[] = process.argv): Promise<void> {
  try {
    await createCli().parseAsync(normalizeCliArgv(argv));
  } catch (err) {
    if (err instanceof CommanderError) {
      process.exitCode = err.exitCode;
      return;
    }

    process.exitCode = reportErrorToStderr(err);
  }
}

function normalizeCliArgv(argv: readonly string[]): readonly string[] {
  if (argv[2] !== "--") {
    return argv;
  }

  return [...argv.slice(0, 2), ...argv.slice(3)];
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
