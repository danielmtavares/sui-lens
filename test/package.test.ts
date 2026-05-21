import { describe, expect, it } from "vitest";

import { normalizePackageResponse } from "../src/api/normalize.js";
import fixture from "./fixtures/package.json" with { type: "json" };

describe("normalizePackageResponse", () => {
  it("maps package RPC data into the internal summary shape", () => {
    const result = normalizePackageResponse(fixture, "mainnet");

    expect(result).toEqual({
      kind: "package",
      modules: ["router", "vault"],
      network: "mainnet",
      packageId: "0xface",
      upgradeCapId: null,
      version: "3",
    });
  });
});
