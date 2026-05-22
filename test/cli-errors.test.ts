import { afterEach, describe, expect, it, vi } from "vitest";

import { runCli } from "../src/cli.js";
import { EXIT_CODES } from "../src/utils/errors.js";

describe("CLI error handling", () => {
  afterEach(() => {
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("returns INVALID_INPUT for malformed command identifiers", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await runCli(["node", "sui-lens", "address", "not-an-id"]);

    expect(process.exitCode).toBe(EXIT_CODES.INVALID_INPUT);
    expect(errorSpy).toHaveBeenCalledWith(
      [
        "Invalid Sui address.",
        "expected: 0x-prefixed hex string with 1 to 64 hex characters",
        "received: not-an-id",
      ].join("\n"),
    );
  });

  it("preserves commander exit codes for parse errors", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const stderrSpy = vi.spyOn(process.stderr, "write").mockReturnValue(true);

    await runCli(["node", "sui-lens", "address"]);

    expect(process.exitCode).toBe(1);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining("missing required argument"));
  });
});
