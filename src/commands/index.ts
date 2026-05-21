import type { Command } from "commander";

import { registerAddressCommand } from "./address.js";
import { registerObjectCommand } from "./object.js";
import { registerPackageCommand } from "./package.js";
import { registerTransactionCommand } from "./tx.js";

export function registerCommands(program: Command): void {
  registerAddressCommand(program);
  registerObjectCommand(program);
  registerTransactionCommand(program);
  registerPackageCommand(program);
}

export {
  registerAddressCommand,
  registerObjectCommand,
  registerPackageCommand,
  registerTransactionCommand,
};
