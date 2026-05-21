import { describe, expect, it } from "vitest";

import { normalizeObjectResponse } from "../src/api/normalize.js";
import fixture from "./fixtures/object.json" with { type: "json" };

describe("normalizeObjectResponse", () => {
  it("maps object RPC data into the internal summary shape", () => {
    const result = normalizeObjectResponse(fixture, "mainnet");

    expect(result).toEqual({
      digest: "3Txd8Qm",
      kind: "object",
      network: "mainnet",
      objectId: "0x1234abcd",
      owner: "0x9999",
      storageRebate: "42",
      type: "0x2::example::Thing",
      version: "7",
    });
  });

  it("handles immutable ownership", () => {
    const result = normalizeObjectResponse(
      {
        data: {
          digest: "digest",
          objectId: "0x1234abcd",
          owner: "Immutable",
          version: "1",
        },
      },
      "testnet",
    );

    expect(result.owner).toBe("Immutable");
    expect(result.digest).toBe("digest");
  });
});
