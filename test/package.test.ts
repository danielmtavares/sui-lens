import { describe, expect, it } from "vitest";

import { normalizePackageResponse } from "../src/api/normalize.js";
import { EXIT_CODES } from "../src/utils/errors.js";
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

  it("fails with a validation error when package object data is missing", () => {
    const error = getThrownError(() =>
      normalizePackageResponse(
        {
          modules: {},
          object: {},
        },
        "mainnet",
      ),
    );

    expect(error).toMatchObject({
      code: EXIT_CODES.VALIDATION_FAILURE,
      message: "Sui RPC returned no package object data.",
    });
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
