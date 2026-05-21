import type { Command } from "commander";

import { createSuiClient, fetchPackageData } from "../api/client.js";
import { normalizePackageResponse } from "../api/normalize.js";
import { formatSummaryJson } from "../format/json.js";
import { formatSummaryTable } from "../format/table.js";
import { assertPackageId } from "../utils/ids.js";
import { addSharedInspectionOptions, type SharedCommandOptions } from "./shared.js";

export type PackageCommandOptions = SharedCommandOptions;

export function registerPackageCommand(program: Command): void {
  const command = addSharedInspectionOptions(
    program.command("package").description("Inspect a Sui package."),
  );

  command.argument("<packageId>", "Sui package ID to inspect");
  command.action(async (packageId: string, options: PackageCommandOptions) => {
    await runPackageCommand(packageId, options);
  });
}

export async function runPackageCommand(
  packageId: string,
  options: PackageCommandOptions,
): Promise<void> {
  const normalizedPackageId = assertPackageId(packageId);
  const client =
    options.network === undefined
      ? createSuiClient()
      : createSuiClient({
          network: options.network,
        });
  const response = await fetchPackageData(client, normalizedPackageId);
  const summary = normalizePackageResponse(response, client.network);
  const output =
    options.json === true || options.format === "json"
      ? formatSummaryJson(summary)
      : formatSummaryTable(summary);

  process.stdout.write(output);
}
