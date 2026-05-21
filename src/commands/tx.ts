import type { Command } from "commander";

import { addSharedInspectionOptions, renderPlaceholderCommand } from "./shared.js";

type TransactionCommandOptions = {
  format?: "json" | "table";
  json?: boolean;
  network?: "devnet" | "mainnet" | "testnet";
};

export function registerTransactionCommand(program: Command): void {
  const command = addSharedInspectionOptions(
    program.command("tx").description("Inspect a Sui transaction."),
  );

  command.argument("<digest>", "Sui transaction digest to inspect");
  command.action(async (digest: string, options: TransactionCommandOptions) => {
    renderPlaceholderCommand({
      identifier: digest,
      kind: "tx",
      options,
    });
  });
}
