import { describe, expect, it } from "vitest";

import { formatSummaryJson } from "../src/format/json.js";
import { formatSummaryTable } from "../src/format/table.js";

describe("formatSummaryTable", () => {
  it("formats an address summary for terminal output", () => {
    const result = formatSummaryTable({
      address: "0x1234567890abcdef",
      balance: {
        mist: "1000",
        sui: "0.000001",
      },
      kind: "address",
      network: "mainnet",
      ownedObjects: {
        count: 2,
        items: [],
      },
      recentTransactions: {
        count: 4,
        digests: [],
      },
    });

    expect(result).toContain("Address");
    expect(result).toContain("Network: mainnet");
    expect(result).toContain("Owned Objects: 2");
    expect(result).toContain("Owned Object Preview: none");
    expect(result).toContain("Recent Transaction Preview: none");
  });

  it("formats a transaction summary for terminal output", () => {
    const result = formatSummaryTable({
      changedObjectsCount: 3,
      digest: "4jA6v7fLQx6oA2KpN8rTsW1b",
      gas: {
        budget: null,
        owner: null,
        paymentCount: null,
        total: null,
      },
      kind: "tx",
      network: "testnet",
      sender: "0xabc",
      status: "success",
      summary: null,
      timestamp: null,
    });

    expect(result).toContain("Transaction");
    expect(result).toContain("Status: success");
    expect(result).toContain("Timestamp: unknown");
    expect(result).toContain("Gas Used: unknown");
    expect(result).toContain("Summary: unknown");
  });
});

describe("formatSummaryJson", () => {
  it("wraps the summary in a stable JSON envelope", () => {
    const result = formatSummaryJson({
      digest: null,
      kind: "object",
      network: "devnet",
      objectId: "0x42",
      owner: null,
      storageRebate: null,
      type: null,
      version: null,
    });

    expect(JSON.parse(result)).toEqual({
      data: {
        digest: null,
        kind: "object",
        network: "devnet",
        objectId: "0x42",
        owner: null,
        storageRebate: null,
        type: null,
        version: null,
      },
      kind: "object",
    });
  });
});
