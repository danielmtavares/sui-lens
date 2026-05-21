import { describe, expect, it } from "vitest";

import { CliError, EXIT_CODES, formatError, toCliError } from "../src/utils/errors.js";

describe("errors", () => {
  it("formats CLI errors with details", () => {
    const error = new CliError("Invalid input.", EXIT_CODES.INVALID_INPUT, {
      details: {
        field: "address",
      },
    });

    expect(formatError(error)).toBe("Invalid input.\nfield: address");
  });

  it("converts generic errors into CLI errors", () => {
    const error = toCliError(new Error("Boom"));

    expect(error).toBeInstanceOf(CliError);
    expect(error.code).toBe(EXIT_CODES.UNKNOWN_FAILURE);
    expect(error.message).toBe("Boom");
  });
});
