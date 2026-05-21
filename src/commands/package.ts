import type { Command } from "commander";

import { addSharedInspectionOptions, renderPlaceholderCommand } from "./shared.js";

type PackageCommandOptions = {
  format?: "json" | "table";
  json?: boolean;
  network?: "devnet" | "mainnet" | "testnet";
};

export function registerPackageCommand(program: Command): void {
  const command = addSharedInspectionOptions(
    program.command("package").description("Inspect a Sui package."),
  );

  command.argument("<packageId>", "Sui package ID to inspect");
  command.action(async (packageId: string, options: PackageCommandOptions) => {
    renderPlaceholderCommand({
      identifier: packageId,
      kind: "package",
      options,
    });
  });
}
