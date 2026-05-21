import type { SupportedNetwork } from "../constants/networks.js";
import type { PackageClientData } from "./client.js";
import {
  addressSummarySchema,
  objectSummarySchema,
  packageSummarySchema,
  summarySchema,
  transactionSummarySchema,
} from "./schemas.js";
import type {
  AddressSummary,
  ObjectSummary,
  PackageSummary,
  SuiSummary,
  TransactionSummary,
} from "./types.js";

export function normalizeAddressSummary(input: unknown): AddressSummary {
  return addressSummarySchema.parse(input);
}

export function normalizeObjectSummary(input: unknown): ObjectSummary {
  return objectSummarySchema.parse(input);
}

export function normalizeTransactionSummary(input: unknown): TransactionSummary {
  return transactionSummarySchema.parse(input);
}

export function normalizePackageSummary(input: unknown): PackageSummary {
  return packageSummarySchema.parse(input);
}

export function normalizePackageResponse(
  input: PackageClientData,
  network: SupportedNetwork,
): PackageSummary {
  return normalizePackageSummary({
    kind: "package",
    modules: Object.keys(input.modules).toSorted(),
    network,
    packageId: input.object.data?.objectId ?? "",
    upgradeCapId: null,
    version: input.object.data?.version ?? null,
  });
}

export function normalizeSummary(input: unknown): SuiSummary {
  return summarySchema.parse(input);
}
