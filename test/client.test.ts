import type {
  CoinBalance,
  PaginatedObjectsResponse,
  PaginatedTransactionResponse,
  SuiMoveNormalizedModules,
  SuiObjectResponse,
  SuiTransactionBlockResponse,
} from "@mysten/sui/jsonRpc";
import { describe, expect, it, vi } from "vitest";

import {
  createSuiClient,
  fetchAddressData,
  fetchObjectData,
  fetchPackageData,
  fetchTransactionData,
  getRpcUrl,
  type SuiLensClient,
} from "../src/api/client.js";
import { EXIT_CODES } from "../src/utils/errors.js";

type AsyncMock<TResult> = () => Promise<TResult>;

describe("createSuiClient", () => {
  it("uses the mainnet RPC URL by default", () => {
    const client = createSuiClient();

    expect(client.network).toBe("mainnet");
    expect(getRpcUrl("mainnet")).toContain("mainnet");
  });
});

describe("client fetch helpers", () => {
  it("fetches address-related RPC data", async () => {
    const client = createFakeClient({
      getBalance: vi.fn<AsyncMock<CoinBalance>>().mockResolvedValue({
        coinObjectCount: 1,
        coinType: "0x2::sui::SUI",
        lockedBalance: {},
        totalBalance: "123",
      }),
      getOwnedObjects: vi
        .fn<AsyncMock<PaginatedObjectsResponse>>()
        .mockResolvedValue({ data: [], hasNextPage: false, nextCursor: null }),
      queryTransactionBlocks: vi
        .fn<AsyncMock<PaginatedTransactionResponse>>()
        .mockResolvedValue({ data: [], hasNextPage: false, nextCursor: null }),
    });

    const result = await fetchAddressData(client, "0x123");

    expect(result.balance.totalBalance).toBe("123");
    expect(client.rpc.getOwnedObjects).toHaveBeenCalled();
    expect(client.rpc.queryTransactionBlocks).toHaveBeenCalled();
  });

  it("fetches object data", async () => {
    const client = createFakeClient({
      getObject: vi.fn<AsyncMock<SuiObjectResponse>>().mockResolvedValue({
        data: {
          digest: "digest",
          objectId: "0x456",
          version: "1",
        },
      }),
    });

    const result = await fetchObjectData(client, "0x456");

    expect(result.data?.objectId).toBe("0x456");
  });

  it("fetches transaction data", async () => {
    const client = createFakeClient({
      getTransactionBlock: vi.fn<AsyncMock<SuiTransactionBlockResponse>>().mockResolvedValue({
        digest: "abc",
      }),
    });

    const result = await fetchTransactionData(client, "abc");

    expect(result.digest).toBe("abc");
  });

  it("fetches package object and modules together", async () => {
    const client = createFakeClient({
      getNormalizedMoveModulesByPackage: vi
        .fn<AsyncMock<SuiMoveNormalizedModules>>()
        .mockResolvedValue({
          router: {} as SuiMoveNormalizedModules[string],
          vault: {} as SuiMoveNormalizedModules[string],
        }),
      getObject: vi.fn<AsyncMock<SuiObjectResponse>>().mockResolvedValue({
        data: {
          digest: "digest",
          objectId: "0x789",
          version: "1",
        },
      }),
    });

    const result = await fetchPackageData(client, "0x789");

    expect(Object.keys(result.modules).toSorted()).toEqual(["router", "vault"]);
    expect(result.object.data?.objectId).toBe("0x789");
  });

  it("translates timeout errors into CLI errors", async () => {
    const client = createFakeClient({
      getObject: vi.fn<AsyncMock<never>>().mockRejectedValue(createAbortError()),
    });

    await expect(fetchObjectData(client, "0xdead")).rejects.toMatchObject({
      code: EXIT_CODES.NETWORK_FAILURE,
      message: "Sui RPC request timed out.",
    });
  });
});

function createFakeClient(
  rpc: Partial<SuiLensClient["rpc"]>,
  overrides: Partial<SuiLensClient> = {},
): SuiLensClient {
  return {
    maxRetries: 0,
    network: "mainnet",
    rpc: {
      getBalance: vi.fn<AsyncMock<CoinBalance>>(),
      getNormalizedMoveModulesByPackage: vi.fn<AsyncMock<SuiMoveNormalizedModules>>(),
      getObject: vi.fn<AsyncMock<SuiObjectResponse>>(),
      getOwnedObjects: vi.fn<AsyncMock<PaginatedObjectsResponse>>(),
      getTransactionBlock: vi.fn<AsyncMock<SuiTransactionBlockResponse>>(),
      queryTransactionBlocks: vi.fn<AsyncMock<PaginatedTransactionResponse>>(),
      ...rpc,
    },
    timeoutMs: 10,
    ...overrides,
  };
}

function createAbortError(): Error {
  const error = new Error("Timed out");
  error.name = "AbortError";
  return error;
}
