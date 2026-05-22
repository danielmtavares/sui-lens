import type {
  AddressSummary,
  ObjectSummary,
  PackageSummary,
  SuiSummary,
  TransactionSummary,
} from "../api/types.js";
import { formatKeyValue, truncateMiddle } from "../utils/terminal.js";

export function formatSummaryTable(summary: SuiSummary): string {
  switch (summary.kind) {
    case "address":
      return formatAddressSummary(summary);
    case "object":
      return formatObjectSummary(summary);
    case "package":
      return formatPackageSummary(summary);
    case "tx":
      return formatTransactionSummary(summary);
  }
}

function formatAddressSummary(summary: AddressSummary): string {
  const ownedObjectPreview =
    summary.ownedObjects.items.length === 0
      ? "none"
      : summary.ownedObjects.items
          .map(object => object.type ?? truncateMiddle(object.objectId))
          .join(", ");
  const recentTransactionPreview =
    summary.recentTransactions.digests.length === 0
      ? "none"
      : summary.recentTransactions.digests.map(digest => truncateMiddle(digest)).join(", ");

  return joinLines([
    "Address",
    formatKeyValue("Address", truncateMiddle(summary.address)),
    formatKeyValue("Network", summary.network),
    formatKeyValue("SUI Balance", summary.balance.sui),
    formatKeyValue("Owned Objects", String(summary.ownedObjects.count)),
    formatKeyValue("Owned Object Preview", ownedObjectPreview),
    formatKeyValue(
      "Recent Transactions",
      summary.recentTransactions.count === null
        ? "unavailable"
        : String(summary.recentTransactions.count),
    ),
    formatKeyValue("Recent Transaction Preview", recentTransactionPreview),
  ]);
}

function formatObjectSummary(summary: ObjectSummary): string {
  return joinLines([
    "Object",
    formatKeyValue("Object ID", truncateMiddle(summary.objectId)),
    formatKeyValue("Network", summary.network),
    formatKeyValue("Type", summary.type ?? "unknown"),
    formatKeyValue("Version", summary.version ?? "unknown"),
    formatKeyValue("Owner", summary.owner ?? "unknown"),
    formatKeyValue("Digest", summary.digest ?? "unknown"),
    formatKeyValue("Storage Rebate", summary.storageRebate ?? "unknown"),
  ]);
}

function formatPackageSummary(summary: PackageSummary): string {
  return joinLines([
    "Package",
    formatKeyValue("Package ID", truncateMiddle(summary.packageId)),
    formatKeyValue("Network", summary.network),
    formatKeyValue("Modules", summary.modules.length === 0 ? "none" : summary.modules.join(", ")),
    formatKeyValue("Version", summary.version ?? "unknown"),
    formatKeyValue("Upgrade Cap", summary.upgradeCapId ?? "unknown"),
  ]);
}

function formatTransactionSummary(summary: TransactionSummary): string {
  return joinLines([
    "Transaction",
    formatKeyValue("Digest", truncateMiddle(summary.digest)),
    formatKeyValue("Network", summary.network),
    formatKeyValue("Status", summary.status),
    formatKeyValue("Sender", summary.sender ?? "unknown"),
    formatKeyValue("Timestamp", summary.timestamp ?? "unknown"),
    formatKeyValue("Gas Used", summary.gas.total ?? "unknown"),
    formatKeyValue(
      "Changed Objects",
      summary.changedObjectsCount === null ? "unknown" : String(summary.changedObjectsCount),
    ),
    formatKeyValue("Summary", summary.summary ?? "unknown"),
  ]);
}

function joinLines(lines: string[]): string {
  return `${lines.join("\n")}\n`;
}
