import { Option, type Command } from "commander";

const NETWORK_CHOICES = ["mainnet", "testnet", "devnet"] as const;
const FORMAT_CHOICES = ["table", "json"] as const;

type SharedCommandOptions = {
  format?: (typeof FORMAT_CHOICES)[number];
  json?: boolean;
  network?: (typeof NETWORK_CHOICES)[number];
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
  console.log(
    [
      `${kind} support is scaffolded but not implemented yet.`,
      `identifier: ${identifier}`,
      `network: ${options.network ?? "mainnet"}`,
      `format: ${resolveFormat(options)}`,
    ].join("\n"),
  );
}

function resolveFormat(options: SharedCommandOptions): (typeof FORMAT_CHOICES)[number] {
  if (options.json === true) {
    return "json";
  }

  return options.format ?? "table";
}
