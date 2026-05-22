import type { Command } from "commander";

import { createSuiClient, fetchAddressData } from "../api/client.js";
import { normalizeAddressResponse } from "../api/normalize.js";
import { assertSuiAddress } from "../utils/ids.js";
import { addSharedInspectionOptions, renderSummary, type SharedCommandOptions } from "./shared.js";

export type AddressCommandOptions = SharedCommandOptions;

export function registerAddressCommand(program: Command): void {
  const command = addSharedInspectionOptions(
    program.command("address").description("Inspect a Sui address."),
  );

  command.argument("<address>", "Sui address to inspect");
  command.action(async (address: string, options: AddressCommandOptions) => {
    await runAddressCommand(address, options);
  });
}

export async function runAddressCommand(
  address: string,
  options: AddressCommandOptions,
): Promise<void> {
  const normalizedAddress = assertSuiAddress(address);
  const client =
    options.network === undefined
      ? createSuiClient()
      : createSuiClient({
          network: options.network,
        });
  const response = await fetchAddressData(client, normalizedAddress);
  const summary = normalizeAddressResponse(response, normalizedAddress, client.network);

  renderSummary(summary, options);
}
