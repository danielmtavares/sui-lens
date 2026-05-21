import { describe, expect, it } from "vitest";

import { createCli } from "../src/index.js";

describe("createCli", () => {
  it("registers the root program metadata", () => {
    const program = createCli();

    expect(program.name()).toBe("sui-lens");
    expect(program.description()).toContain("Inspect Sui addresses");
  });

  it("registers the planned top-level commands", () => {
    const program = createCli();
    const commandNames = program.commands.map(command => command.name());

    expect(commandNames).toEqual(["address", "object", "tx", "package"]);
  });
});
