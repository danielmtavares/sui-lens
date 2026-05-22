import { describe, expect, it } from "vitest";

import { CliError, EXIT_CODES } from "../src/utils/errors.js";
import {
  assertObjectId,
  assertPackageId,
  assertSuiAddress,
  assertTransactionDigest,
  isSuiHexId,
  isTransactionDigest,
} from "../src/utils/ids.js";

describe("ids", () => {
  it("accepts valid hex IDs", () => {
    expect(isSuiHexId("0x1234abcd")).toBe(true);
    expect(assertSuiAddress("0x1234abcd")).toBe("0x1234abcd");
    expect(assertObjectId("0x1234abcd")).toBe("0x1234abcd");
    expect(assertPackageId("0x1234abcd")).toBe("0x1234abcd");
  });

  it("rejects malformed hex IDs", () => {
    expect(isSuiHexId("1234abcd")).toBe(false);
    const invalidAddressError = getThrownError(() => assertSuiAddress("not-an-id"));

    expect(invalidAddressError).toBeInstanceOf(CliError);
    expect(invalidAddressError).toMatchObject({
      code: EXIT_CODES.INVALID_INPUT,
      details: {
        expected: "0x-prefixed hex string with 1 to 64 hex characters",
        received: "not-an-id",
      },
      message: "Invalid Sui address.",
    });
  });

  it("accepts transaction digests with base58 characters", () => {
    const digest = "4jA6v7fLQx6oA2KpN8rTsW1b";

    expect(isTransactionDigest(digest)).toBe(true);
    expect(assertTransactionDigest(digest)).toBe(digest);
  });

  it("rejects malformed transaction digests", () => {
    expect(isTransactionDigest("0x1234")).toBe(false);
    expect(() => assertTransactionDigest("not-a-digest")).toThrowError(CliError);
  });
});

function getThrownError(callback: () => unknown): unknown {
  try {
    callback();
  } catch (error) {
    return error;
  }

  throw new Error("Expected callback to throw.");
}
