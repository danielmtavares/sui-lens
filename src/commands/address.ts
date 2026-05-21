import type { Command } from "commander";

import { addSharedInspectionOptions, renderPlaceholderCommand } from "./shared.js";

type AddressCommandOptions = {
  format?: "json" | "table";
  json?: boolean;
  network?: "devnet" | "mainnet" | "testnet";
};

export function registerAddressCommand(program: Command): void {
  const command = addSharedInspectionOptions(
    program.command("address").description("Inspect a Sui address."),
  );

  command.argument("<address>", "Sui address to inspect");
  command.action(async (address: string, options: AddressCommandOptions) => {
    renderPlaceholderCommand({
      identifier: address,
      kind: "address",
      options,
    });
  });
}
