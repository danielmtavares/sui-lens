import { describe, it, expect } from "vitest";

import { createCli } from "../src/cli.js";

describe("CLI help", () => {
  it("includes Examples in help output", () => {
    const cli = createCli();
    const help = cli.helpInformation();
    expect(help).toContain("Examples:");
    expect(help).toContain("sui-lens address 0x");
  });
});
