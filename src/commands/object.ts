import type { Command } from "commander";

import { addSharedInspectionOptions, renderPlaceholderCommand } from "./shared.js";

type ObjectCommandOptions = {
  format?: "json" | "table";
  json?: boolean;
  network?: "devnet" | "mainnet" | "testnet";
};

export function registerObjectCommand(program: Command): void {
  const command = addSharedInspectionOptions(
    program.command("object").description("Inspect a Sui object."),
  );

  command.argument("<objectId>", "Sui object ID to inspect");
  command.action(async (objectId: string, options: ObjectCommandOptions) => {
    renderPlaceholderCommand({
      identifier: objectId,
      kind: "object",
      options,
    });
  });
}
