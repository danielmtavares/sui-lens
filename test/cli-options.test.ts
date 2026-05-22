import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AddressSummary,
  ObjectSummary,
  PackageSummary,
  TransactionSummary,
} from "../src/api/types.js";
import type { SupportedNetwork } from "../src/constants/networks.js";

type ClientMock = {
  maxRetries: number;
  network: SupportedNetwork;
  rpc: Record<string, never>;
  timeoutMs: number;
};

type CreateSuiClientMock = (options?: { network?: SupportedNetwork }) => ClientMock;
type FetchMock = () => Promise<Record<string, never>>;
type NormalizeAddressMock = (
  response: unknown,
  address: string,
  network: SupportedNetwork,
) => AddressSummary;
type NormalizeSummaryMock<TSummary> = (response: unknown, network: SupportedNetwork) => TSummary;

const mocks = vi.hoisted(() => {
  const createSuiClient = vi.fn<CreateSuiClientMock>(
    (options?: { network?: SupportedNetwork }) => ({
      maxRetries: 0,
      network: options?.network ?? "mainnet",
      rpc: {},
      timeoutMs: 0,
    }),
  );

  return {
    createSuiClient,
    fetchAddressData: vi.fn<FetchMock>(async () => ({})),
    fetchObjectData: vi.fn<FetchMock>(async () => ({})),
    fetchPackageData: vi.fn<FetchMock>(async () => ({})),
    fetchTransactionData: vi.fn<FetchMock>(async () => ({})),
    normalizeAddressResponse: vi.fn<NormalizeAddressMock>(
      (_response: unknown, address: string, network: SupportedNetwork) => ({
        address,
        balance: {
          mist: "0",
          sui: "0",
        },
        kind: "address" as const,
        network,
        ownedObjects: {
          count: 0,
          items: [],
        },
        recentTransactions: {
          count: 0,
          digests: [],
        },
      }),
    ),
    normalizeObjectResponse: vi.fn<NormalizeSummaryMock<ObjectSummary>>(
      (_response: unknown, network: SupportedNetwork) => ({
        digest: "object-digest",
        kind: "object" as const,
        network,
        objectId: "0x1234abcd",
        owner: "0x9999",
        storageRebate: "42",
        type: "0x2::example::Thing",
        version: "7",
      }),
    ),
    normalizePackageResponse: vi.fn<NormalizeSummaryMock<PackageSummary>>(
      (_response: unknown, network: SupportedNetwork) => ({
        kind: "package" as const,
        modules: ["router", "vault"],
        network,
        packageId: "0xface",
        upgradeCapId: null,
        version: "3",
      }),
    ),
    normalizeTransactionResponse: vi.fn<NormalizeSummaryMock<TransactionSummary>>(
      (_response: unknown, network: SupportedNetwork) => ({
        changedObjectsCount: 4,
        digest: "3CBjjegmN5jjcUHRz3CNoKEHESFpPRpH1UeNfm17bV4N",
        gas: {
          budget: "5000000",
          owner: "0xabc",
          paymentCount: 1,
          total: "1150",
        },
        kind: "tx" as const,
        network,
        sender: "0xabc",
        status: "success" as const,
        summary: "Move call",
        timestamp: "2024-05-21T17:00:00.000Z",
      }),
    ),
  };
});

vi.mock("../src/api/client.js", () => ({
  createSuiClient: mocks.createSuiClient,
  fetchAddressData: mocks.fetchAddressData,
  fetchObjectData: mocks.fetchObjectData,
  fetchPackageData: mocks.fetchPackageData,
  fetchTransactionData: mocks.fetchTransactionData,
}));

vi.mock("../src/api/normalize.js", () => ({
  normalizeAddressResponse: mocks.normalizeAddressResponse,
  normalizeObjectResponse: mocks.normalizeObjectResponse,
  normalizePackageResponse: mocks.normalizePackageResponse,
  normalizeTransactionResponse: mocks.normalizeTransactionResponse,
}));

import { runCli } from "../src/cli.js";

type CommandCase = {
  command: "address" | "object" | "package" | "tx";
  expectedKind: "address" | "object" | "package" | "tx";
  expectedTableText: string;
  id: string;
};

const COMMAND_CASES: readonly CommandCase[] = [
  {
    command: "address",
    expectedKind: "address",
    expectedTableText: "Address:",
    id: "0xac5bceec1b789ff840d7d4e6ce4ce61c90d190a7f8c4f4ddf0bff6ee2413c33c",
  },
  {
    command: "object",
    expectedKind: "object",
    expectedTableText: "Object ID:",
    id: "0x00cb1675990d628ff2976f53084181df2fd0b8d8e906b85f93d31671d17f41c3",
  },
  {
    command: "tx",
    expectedKind: "tx",
    expectedTableText: "Transaction",
    id: "3CBjjegmN5jjcUHRz3CNoKEHESFpPRpH1UeNfm17bV4N",
  },
  {
    command: "package",
    expectedKind: "package",
    expectedTableText: "Package ID:",
    id: "0x0000000000000000000000000000000000000000000000000000000000000003",
  },
];

const NETWORKS: readonly SupportedNetwork[] = ["mainnet", "testnet", "devnet"];

describe("CLI option parsing", () => {
  beforeEach(() => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    vi.spyOn(process.stderr, "write").mockReturnValue(true);
  });

  afterEach(() => {
    process.exitCode = undefined;
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it.each(COMMAND_CASES)("accepts --json after the %s positional", async commandCase => {
    await runCli(["node", "sui-lens", "--", commandCase.command, commandCase.id, "--json"]);

    const output = getStdout();
    const parsed = JSON.parse(output) as { kind: string };

    expect(process.exitCode).toBeUndefined();
    expect(parsed.kind).toBe(commandCase.expectedKind);
  });

  it.each(COMMAND_CASES)("accepts --json before the %s positional", async commandCase => {
    await runCli(["node", "sui-lens", "--", commandCase.command, "--json", commandCase.id]);

    const output = getStdout();
    const parsed = JSON.parse(output) as { kind: string };

    expect(process.exitCode).toBeUndefined();
    expect(parsed.kind).toBe(commandCase.expectedKind);
  });

  it.each(COMMAND_CASES)("accepts --format json after the %s positional", async commandCase => {
    await runCli([
      "node",
      "sui-lens",
      "--",
      commandCase.command,
      commandCase.id,
      "--format",
      "json",
    ]);

    const output = getStdout();
    const parsed = JSON.parse(output) as { kind: string };

    expect(process.exitCode).toBeUndefined();
    expect(parsed.kind).toBe(commandCase.expectedKind);
  });

  it.each(COMMAND_CASES)("accepts --format table after the %s positional", async commandCase => {
    await runCli([
      "node",
      "sui-lens",
      "--",
      commandCase.command,
      commandCase.id,
      "--format",
      "table",
    ]);

    expect(process.exitCode).toBeUndefined();
    expect(getStdout()).toContain(commandCase.expectedTableText);
  });

  it.each(COMMAND_CASES)("accepts all supported networks for %s", async commandCase => {
    for (const network of NETWORKS) {
      vi.mocked(process.stdout.write).mockClear();
      mocks.createSuiClient.mockClear();

      await runCli([
        "node",
        "sui-lens",
        "--",
        commandCase.command,
        commandCase.id,
        "--network",
        network,
      ]);

      expect(process.exitCode).toBeUndefined();
      expect(mocks.createSuiClient).toHaveBeenCalledWith({ network });
      expect(getStdout()).toContain(`Network: ${network}`);
    }
  });

  it("accepts root help through the package-manager separator", async () => {
    await runCli(["node", "sui-lens", "--", "--help"]);

    expect(process.exitCode).toBe(0);
    expect(getStdout()).toContain("Usage: sui-lens");
  });

  it("accepts root version through the package-manager separator", async () => {
    await runCli(["node", "sui-lens", "--", "--version"]);

    expect(process.exitCode).toBe(0);
    expect(getStdout()).toContain("0.0.1");
  });
});

function getStdout(): string {
  return vi
    .mocked(process.stdout.write)
    .mock.calls.map(call => String(call[0]))
    .join("");
}
