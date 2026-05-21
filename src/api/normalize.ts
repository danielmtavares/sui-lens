import type { SuiObjectResponse } from "@mysten/sui/jsonRpc";

import type { SupportedNetwork } from "../constants/networks.js";
import { CliError, EXIT_CODES } from "../utils/errors.js";
import type { AddressClientData, PackageClientData } from "./client.js";
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

export function normalizeAddressResponse(
  input: AddressClientData,
  address: string,
  network: SupportedNetwork,
): AddressSummary {
  return normalizeAddressSummary({
    address,
    balance: {
      mist: input.balance.totalBalance,
      sui: formatMistAsSui(input.balance.totalBalance),
    },
    kind: "address",
    network,
    ownedObjects: {
      count: input.ownedObjects.data.length,
      items: input.ownedObjects.data.map(object => ({
        objectId: object.data?.objectId ?? getOwnedObjectErrorId(object.error),
        type: object.data?.type ?? null,
      })),
    },
    recentTransactions: {
      count: input.recentTransactions.data.length,
      digests: input.recentTransactions.data.map(transaction => transaction.digest),
    },
  });
}

export function normalizeObjectSummary(input: unknown): ObjectSummary {
  return objectSummarySchema.parse(input);
}

export function normalizeObjectResponse(
  input: SuiObjectResponse,
  network: SupportedNetwork,
): ObjectSummary {
  if (input.error !== undefined && input.error !== null) {
    throw new CliError(
      "Sui RPC returned an error for the requested object.",
      EXIT_CODES.PROVIDER_FAILURE,
      {
        details: {
          code: input.error.code,
        },
      },
    );
  }

  if (input.data === undefined || input.data === null) {
    throw new CliError("Sui RPC returned no object data.", EXIT_CODES.VALIDATION_FAILURE);
  }

  return normalizeObjectSummary({
    digest: input.data.previousTransaction ?? input.data.digest,
    kind: "object",
    network,
    objectId: input.data.objectId,
    owner: normalizeObjectOwner(input.data.owner),
    storageRebate: input.data.storageRebate ?? null,
    type: input.data.type ?? null,
    version: input.data.version ?? null,
  });
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

function formatMistAsSui(mist: string): string {
  const mistValue = BigInt(mist);
  const whole = mistValue / 1_000_000_000n;
  const fraction = `${mistValue % 1_000_000_000n}`.padStart(9, "0").replace(/0+$/, "");

  if (fraction.length === 0) {
    return whole.toString();
  }

  return `${whole}.${fraction}`;
}

function getOwnedObjectErrorId(
  error: AddressClientData["ownedObjects"]["data"][number]["error"],
): string {
  if (error === undefined || error === null) {
    return "unknown";
  }

  if ("object_id" in error) {
    return error.object_id;
  }

  return "unknown";
}

function normalizeObjectOwner(
  owner: NonNullable<SuiObjectResponse["data"]>["owner"],
): string | null {
  if (owner === undefined || owner === null) {
    return null;
  }

  if (owner === "Immutable") {
    return owner;
  }

  if ("AddressOwner" in owner) {
    return owner.AddressOwner;
  }

  if ("ObjectOwner" in owner) {
    return owner.ObjectOwner;
  }

  if ("ConsensusAddressOwner" in owner) {
    return owner.ConsensusAddressOwner.owner;
  }

  return `Shared(${owner.Shared.initial_shared_version})`;
}
