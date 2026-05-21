import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";
import { describe, expect, it } from "vitest";

import { normalizeTransactionResponse } from "../src/api/normalize.js";
import fixture from "./fixtures/tx.json" with { type: "json" };

const txFixture = fixture as unknown as SuiTransactionBlockResponse;

describe("normalizeTransactionResponse", () => {
  it("maps transaction RPC data into the internal summary shape", () => {
    const result = normalizeTransactionResponse(txFixture, "mainnet");

    expect(result).toEqual({
      changedObjectsCount: 4,
      digest: "4jA6v7fLQx6oA2KpN8rTsW1b",
      gas: {
        budget: "5000000",
        owner: "0xabc",
        paymentCount: 1,
        total: "1150",
      },
      kind: "tx",
      network: "mainnet",
      sender: "0xabc",
      status: "success",
      summary: "0x2::sui::transfer",
      timestamp: "2024-05-21T15:40:00.000Z",
    });
  });

  it("falls back to effect counts when object changes are unavailable", () => {
    const result = normalizeTransactionResponse(
      {
        digest: "4jA6v7fLQx6oA2KpN8rTsW1c",
        effects: {
          messageVersion: "v1",
          status: {
            status: "failure",
            error: "Move abort",
          },
          executedEpoch: "1",
          transactionDigest: "4jA6v7fLQx6oA2KpN8rTsW1c",
          gasUsed: {
            computationCost: "10",
            storageCost: "0",
            storageRebate: "0",
            nonRefundableStorageFee: "0",
          },
          gasObject: {
            owner: {
              AddressOwner: "0xabc",
            },
            reference: {
              objectId: "0xgas",
              version: "1",
              digest: "GasDigest1",
            },
          },
          created: [
            {
              owner: { AddressOwner: "0xabc" },
              reference: { objectId: "0x1", version: "1", digest: "Digest1" },
            },
            {
              owner: { AddressOwner: "0xabc" },
              reference: { objectId: "0x2", version: "1", digest: "Digest2" },
            },
          ],
          mutated: [
            {
              owner: { AddressOwner: "0xabc" },
              reference: { objectId: "0x3", version: "2", digest: "Digest3" },
            },
          ],
          deleted: [],
        },
      },
      "testnet",
    );

    expect(result.status).toBe("failure");
    expect(result.changedObjectsCount).toBe(3);
    expect(result.summary).toBeNull();
  });
});
