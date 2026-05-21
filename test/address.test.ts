import { describe, expect, it } from "vitest";

import { normalizeAddressResponse } from "../src/api/normalize.js";
import fixture from "./fixtures/address.json" with { type: "json" };

describe("normalizeAddressResponse", () => {
  it("maps address RPC data into the internal summary shape", () => {
    const result = normalizeAddressResponse(fixture, "0x1234", "mainnet");

    expect(result).toEqual({
      address: "0x1234",
      balance: {
        mist: "1234000000",
        sui: "1.234",
      },
      kind: "address",
      network: "mainnet",
      ownedObjects: {
        count: 2,
        items: [
          {
            objectId: "0xaaa",
            type: "0x2::coin::Coin<0x2::sui::SUI>",
          },
          {
            objectId: "0xbbb",
            type: "0x2::example::Badge",
          },
        ],
      },
      recentTransactions: {
        count: 2,
        digests: ["tx-1", "tx-2"],
      },
    });
  });
});
