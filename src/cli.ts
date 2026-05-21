#!/usr/bin/env node

import { pathToFileURL } from "node:url";

import { Command } from "commander";

import packageJson from "../package.json" with { type: "json" };
import { registerCommands } from "./commands/index.js";

export function createCli(): Command {
  const program = new Command();

  program
    .name("sui-lens")
    .description("Inspect Sui addresses, objects, transactions, and packages from the terminal.")
    .version(packageJson.version)
    .showHelpAfterError()
    .showSuggestionAfterError();

  registerCommands(program);

  return program;
}

export async function runCli(argv: readonly string[] = process.argv): Promise<void> {
  await createCli().parseAsync(argv);
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
