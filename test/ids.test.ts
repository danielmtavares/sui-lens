import { describe, expect, it } from "vitest";

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
    expect(() => assertSuiAddress("not-an-id")).toThrow("Invalid Sui address.");
  });

  it("accepts transaction digests with base58 characters", () => {
    const digest = "4jA6v7fLQx6oA2KpN8rTsW1b";

    expect(isTransactionDigest(digest)).toBe(true);
    expect(assertTransactionDigest(digest)).toBe(digest);
  });

  it("rejects malformed transaction digests", () => {
    expect(isTransactionDigest("0x1234")).toBe(false);
    expect(() => assertTransactionDigest("not-a-digest")).toThrow(
      "Invalid Sui transaction digest.",
    );
  });
});
