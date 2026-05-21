import { describe, expect, it } from "vitest";

import { getSuiLensMessage } from "../src/index.js";

describe("getSuiLensMessage", () => {
  it("returns the sui-lens placeholder message", () => {
    expect(getSuiLensMessage()).toBe("sui-lens is ready for implementation.");
  });
});
