import type { Command } from "commander";

import { createSuiClient, fetchObjectData } from "../api/client.js";
import { normalizeObjectResponse } from "../api/normalize.js";
import { assertObjectId } from "../utils/ids.js";
import { addSharedInspectionOptions, renderSummary, type SharedCommandOptions } from "./shared.js";

export type ObjectCommandOptions = SharedCommandOptions;

export function registerObjectCommand(program: Command): void {
  const command = addSharedInspectionOptions(
    program.command("object").description("Inspect a Sui object."),
  );

  command.argument("<objectId>", "Sui object ID to inspect");
  command.action(async (objectId: string, options: ObjectCommandOptions) => {
    await runObjectCommand(objectId, options);
  });
}

export async function runObjectCommand(
  objectId: string,
  options: ObjectCommandOptions,
): Promise<void> {
  const normalizedObjectId = assertObjectId(objectId);
  const client =
    options.network === undefined
      ? createSuiClient()
      : createSuiClient({
          network: options.network,
        });
  const response = await fetchObjectData(client, normalizedObjectId);
  const summary = normalizeObjectResponse(response, client.network);

  renderSummary(summary, options);
}
