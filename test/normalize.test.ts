import { describe, expect, it } from "vitest";

import {
  normalizeAddressSummary,
  normalizePackageSummary,
  normalizeSummary,
  normalizeTransactionSummary,
} from "../src/api/normalize.js";

describe("normalizeSummary", () => {
  it("parses an address summary", () => {
    const result = normalizeAddressSummary({
      address: "0x1234",
      balance: {
        mist: "1000",
        sui: "0.000001",
      },
      kind: "address",
      network: "mainnet",
      ownedObjects: {
        count: 1,
        items: [
          {
            objectId: "0x9999",
            type: "0x2::coin::Coin<0x2::sui::SUI>",
          },
        ],
      },
      recentTransactions: {
        count: 1,
        digests: ["8VnQxj7KZ"],
      },
    });

    expect(result.kind).toBe("address");
    expect(result.ownedObjects.count).toBe(1);
  });

  it("parses a transaction summary through the union schema", () => {
    const result = normalizeSummary({
      changedObjectsCount: 4,
      digest: "6Q7A4LzN",
      gas: {
        budget: "1000",
        owner: "0xabc",
        paymentCount: 1,
        total: "900",
      },
      kind: "tx",
      network: "testnet",
      sender: "0xabc",
      status: "success",
      summary: "Transfer SUI",
      timestamp: "2026-05-21T15:00:00.000Z",
    });

    expect(result.kind).toBe("tx");

    if (result.kind !== "tx") {
      throw new Error("Expected a transaction summary.");
    }

    expect(result.status).toBe("success");
  });

  it("parses a package summary", () => {
    const result = normalizePackageSummary({
      kind: "package",
      modules: ["vault", "router"],
      network: "devnet",
      packageId: "0x42",
      upgradeCapId: null,
      version: "3",
    });

    expect(result.modules).toEqual(["vault", "router"]);
  });

  it("rejects malformed data", () => {
    expect(() =>
      normalizeTransactionSummary({
        changedObjectsCount: -1,
        digest: "",
        gas: {
          budget: null,
          owner: null,
          paymentCount: null,
          total: null,
        },
        kind: "tx",
        network: "mainnet",
        sender: null,
        status: "success",
        summary: null,
        timestamp: null,
      }),
    ).toThrow(/.+/);
  });
});
