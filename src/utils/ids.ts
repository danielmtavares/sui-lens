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

  throw new Error("Invalid Sui transaction digest.");
}

function assertMatchingId(value: string, label: string): string {
  if (isSuiHexId(value)) {
    return value;
  }

  throw new Error(`Invalid ${label}.`);
}
