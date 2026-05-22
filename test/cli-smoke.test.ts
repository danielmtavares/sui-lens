import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const CLI_ENTRYPOINT = new URL("../src/cli.ts", import.meta.url);

describe("CLI smoke tests", () => {
  it("prints help output from the CLI entrypoint", async () => {
    const result = await execCli(["--help"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Inspect Sui addresses");
    expect(result.stdout).toContain("Examples:");
    expect(result.stderr).toBe("");
  });

  it("returns a stable invalid-input error for an address command", async () => {
    const result = await execCli(["address", "not-an-id"]);

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Invalid Sui address.");
    expect(result.stderr).toContain("expected: 0x-prefixed hex string with 1 to 64 hex characters");
    expect(result.stderr).toContain("received: not-an-id");
  });
});

async function execCli(args: readonly string[]): Promise<{
  exitCode: number;
  stderr: string;
  stdout: string;
}> {
  try {
    const result = await execFileAsync(
      process.execPath,
      ["--import", "tsx", CLI_ENTRYPOINT.pathname, ...args],
      {
        cwd: new URL("..", import.meta.url),
        encoding: "utf8",
      },
    );

    return {
      exitCode: 0,
      stderr: result.stderr,
      stdout: result.stdout,
    };
  } catch (error) {
    if (isExecError(error)) {
      return {
        exitCode: error.code ?? 1,
        stderr: error.stderr,
        stdout: error.stdout,
      };
    }

    throw error;
  }
}

function isExecError(
  error: unknown,
): error is Error & { code?: number; stderr: string; stdout: string } {
  return (
    error instanceof Error &&
    "stderr" in error &&
    typeof error.stderr === "string" &&
    "stdout" in error &&
    typeof error.stdout === "string"
  );
}
