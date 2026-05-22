import { CliError, EXIT_CODES } from "./errors.js";

const SUI_HEX_ID_PATTERN = /^0x[0-9a-fA-F]{1,64}$/;
const SUI_DIGEST_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{20,64}$/;

export function isSuiHexId(value: string): boolean {
  return SUI_HEX_ID_PATTERN.test(value);
}

export function isTransactionDigest(value: string): boolean {
  return SUI_DIGEST_PATTERN.test(value);
}

export function assertSuiAddress(value: string): string {
  return assertMatchingId(value, "Sui address");
}

export function assertObjectId(value: string): string {
  return assertMatchingId(value, "Sui object ID");
}

export function assertPackageId(value: string): string {
  return assertMatchingId(value, "Sui package ID");
}

export function assertTransactionDigest(value: string): string {
  if (isTransactionDigest(value)) {
    return value;
  }

  throw new CliError("Invalid Sui transaction digest.", EXIT_CODES.INVALID_INPUT, {
    details: {
      expected: "base58 digest with 20 to 64 characters",
      received: value,
    },
  });
}

function assertMatchingId(value: string, label: string): string {
  if (isSuiHexId(value)) {
    return value;
  }

  throw new CliError(`Invalid ${label}.`, EXIT_CODES.INVALID_INPUT, {
    details: {
      expected: "0x-prefixed hex string with 1 to 64 hex characters",
      received: value,
    },
  });
}
