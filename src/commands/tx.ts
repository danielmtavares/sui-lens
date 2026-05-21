import type { Command } from "commander";

import { createSuiClient, fetchTransactionData } from "../api/client.js";
import { normalizeTransactionResponse } from "../api/normalize.js";
import { assertTransactionDigest } from "../utils/ids.js";
import { addSharedInspectionOptions, renderSummary, type SharedCommandOptions } from "./shared.js";

export type TransactionCommandOptions = SharedCommandOptions;

export function registerTransactionCommand(program: Command): void {
  const command = addSharedInspectionOptions(
    program.command("tx").description("Inspect a Sui transaction."),
  );

  command.argument("<digest>", "Sui transaction digest to inspect");
  command.action(async (digest: string, options: TransactionCommandOptions) => {
    await runTransactionCommand(digest, options);
  });
}

export async function runTransactionCommand(
  digest: string,
  options: TransactionCommandOptions,
): Promise<void> {
  const normalizedDigest = assertTransactionDigest(digest);
  const client =
    options.network === undefined
      ? createSuiClient()
      : createSuiClient({
          network: options.network,
        });
  const response = await fetchTransactionData(client, normalizedDigest);
  const summary = normalizeTransactionResponse(response, client.network);

  renderSummary(summary, options);
}
