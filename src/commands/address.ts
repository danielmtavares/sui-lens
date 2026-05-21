import type { Command } from "commander";

import { createSuiClient, fetchAddressData } from "../api/client.js";
import { normalizeAddressResponse } from "../api/normalize.js";
import { formatSummaryJson } from "../format/json.js";
import { formatSummaryTable } from "../format/table.js";
import { assertSuiAddress } from "../utils/ids.js";
import { addSharedInspectionOptions, type SharedCommandOptions } from "./shared.js";

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
  const output =
    options.json === true || options.format === "json"
      ? formatSummaryJson(summary)
      : formatSummaryTable(summary);

  process.stdout.write(output);
}
