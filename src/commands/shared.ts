import { Option, type Command } from "commander";

import type { OutputFormat, SuiSummary } from "../api/types.js";
import { DEFAULT_NETWORK, type SupportedNetwork } from "../constants/networks.js";
import { formatSummaryJson } from "../format/json.js";
import { formatSummaryTable } from "../format/table.js";

const NETWORK_CHOICES = ["mainnet", "testnet", "devnet"] as const;
const FORMAT_CHOICES = ["table", "json"] as const;

export type SharedCommandOptions = {
  format?: OutputFormat;
  json?: boolean;
  network?: SupportedNetwork;
};

type PlaceholderRenderInput = {
  identifier: string;
  kind: "address" | "object" | "package" | "tx";
  options: SharedCommandOptions;
};

export function addSharedInspectionOptions(command: Command): Command {
  return command
    .option("--json", "emit machine-readable JSON output")
    .addOption(
      new Option("--format <format>", "choose output format")
        .choices(FORMAT_CHOICES)
        .default("table"),
    )
    .addOption(
      new Option("--network <network>", "choose a Sui network")
        .choices(NETWORK_CHOICES)
        .default("mainnet"),
    );
}

export function renderPlaceholderCommand({
  identifier,
  kind,
  options,
}: PlaceholderRenderInput): void {
  const summary = createPlaceholderSummary(kind, identifier, options.network ?? DEFAULT_NETWORK);
  const format = resolveFormat(options);

  process.stdout.write(
    format === "json" ? formatSummaryJson(summary) : formatSummaryTable(summary),
  );
}

function resolveFormat(options: SharedCommandOptions): OutputFormat {
  if (options.json === true) {
    return "json";
  }

  return options.format ?? "table";
}

function createPlaceholderSummary(
  kind: SuiSummary["kind"],
  identifier: string,
  network: SupportedNetwork,
): SuiSummary {
  switch (kind) {
    case "address":
      return {
        address: identifier,
        balance: {
          mist: "0",
          sui: "0",
        },
        kind,
        network,
        ownedObjects: {
          count: 0,
          items: [],
        },
        recentTransactions: {
          count: 0,
          digests: [],
        },
      };
    case "object":
      return {
        digest: null,
        kind,
        network,
        objectId: identifier,
        owner: null,
        storageRebate: null,
        type: null,
        version: null,
      };
    case "package":
      return {
        kind,
        modules: [],
        network,
        packageId: identifier,
        upgradeCapId: null,
        version: null,
      };
    case "tx":
      return {
        changedObjectsCount: 0,
        digest: identifier,
        gas: {
          budget: null,
          owner: null,
          paymentCount: null,
          total: null,
        },
        kind,
        network,
        sender: null,
        status: "unknown",
        summary: null,
        timestamp: null,
      };
  }
}
