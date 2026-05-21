import {
  JsonRpcError,
  SuiHTTPStatusError,
  SuiHTTPTransportError,
  SuiJsonRpcClient,
  getJsonRpcFullnodeUrl,
  type CoinBalance,
  type PaginatedObjectsResponse,
  type PaginatedTransactionResponse,
  type SuiMoveNormalizedModules,
  type SuiObjectResponse,
  type SuiTransactionBlockResponse,
} from "@mysten/sui/jsonRpc";

import { DEFAULT_NETWORK, type SupportedNetwork } from "../constants/networks.js";
import { CliError, EXIT_CODES } from "../utils/errors.js";

const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_TIMEOUT_MS = 8_000;
const PREVIEW_LIMIT = 5;

type SuiReadClient = Pick<
  SuiJsonRpcClient,
  | "getBalance"
  | "getNormalizedMoveModulesByPackage"
  | "getObject"
  | "getOwnedObjects"
  | "getTransactionBlock"
  | "queryTransactionBlocks"
>;

export type SuiLensClient = {
  maxRetries: number;
  network: SupportedNetwork;
  rpc: SuiReadClient;
  timeoutMs: number;
};

export type AddressClientData = {
  balance: CoinBalance;
  ownedObjects: PaginatedObjectsResponse;
  recentTransactions: PaginatedTransactionResponse;
};

export type PackageClientData = {
  modules: SuiMoveNormalizedModules;
  object: SuiObjectResponse;
};

type CreateSuiClientOptions = {
  maxRetries?: number;
  network?: SupportedNetwork;
  timeoutMs?: number;
  url?: string;
};

export function createSuiClient(options: CreateSuiClientOptions = {}): SuiLensClient {
  const network = options.network ?? DEFAULT_NETWORK;

  return {
    maxRetries: options.maxRetries ?? DEFAULT_MAX_RETRIES,
    network,
    rpc: new SuiJsonRpcClient({
      network,
      url: options.url ?? getRpcUrl(network),
    }),
    timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  };
}

export function getRpcUrl(network: SupportedNetwork): string {
  return getJsonRpcFullnodeUrl(network);
}

export async function fetchAddressData(
  client: SuiLensClient,
  address: string,
): Promise<AddressClientData> {
  const [balance, ownedObjects, recentTransactions] = await Promise.all([
    runClientRequest(client, signal => client.rpc.getBalance({ owner: address, signal })),
    runClientRequest(client, signal =>
      client.rpc.getOwnedObjects({
        limit: PREVIEW_LIMIT,
        options: {
          showType: true,
        },
        owner: address,
        signal,
      }),
    ),
    runClientRequest(client, signal =>
      client.rpc.queryTransactionBlocks({
        filter: {
          FromAddress: address,
        },
        limit: PREVIEW_LIMIT,
        order: "descending",
        signal,
      }),
    ),
  ]);

  return {
    balance,
    ownedObjects,
    recentTransactions,
  };
}

export function fetchObjectData(
  client: SuiLensClient,
  objectId: string,
): Promise<SuiObjectResponse> {
  return runClientRequest(client, signal =>
    client.rpc.getObject({
      id: objectId,
      options: {
        showOwner: true,
        showPreviousTransaction: true,
        showStorageRebate: true,
        showType: true,
      },
      signal,
    }),
  );
}

export function fetchTransactionData(
  client: SuiLensClient,
  digest: string,
): Promise<SuiTransactionBlockResponse> {
  return runClientRequest(client, signal =>
    client.rpc.getTransactionBlock({
      digest,
      options: {
        showEffects: true,
        showInput: true,
        showObjectChanges: true,
      },
      signal,
    }),
  );
}

export async function fetchPackageData(
  client: SuiLensClient,
  packageId: string,
): Promise<PackageClientData> {
  const [object, modules] = await Promise.all([
    runClientRequest(client, signal =>
      client.rpc.getObject({
        id: packageId,
        options: {
          showType: true,
        },
        signal,
      }),
    ),
    runClientRequest(client, signal =>
      client.rpc.getNormalizedMoveModulesByPackage({
        package: packageId,
        signal,
      }),
    ),
  ]);

  return {
    modules,
    object,
  };
}

async function runClientRequest<T>(
  client: SuiLensClient,
  request: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= client.maxRetries) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), client.timeoutMs);

    try {
      return await request(controller.signal);
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === client.maxRetries) {
        throw translateClientError(error);
      }
    } finally {
      clearTimeout(timeout);
    }

    attempt += 1;
  }

  throw translateClientError(lastError);
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof SuiHTTPTransportError) {
    return true;
  }

  if (error instanceof SuiHTTPStatusError) {
    return error.status >= 500;
  }

  if (error instanceof JsonRpcError) {
    return false;
  }

  return error instanceof Error && error.name === "AbortError";
}

function translateClientError(error: unknown): CliError {
  if (error instanceof CliError) {
    return error;
  }

  if (error instanceof SuiHTTPTransportError) {
    return new CliError("Network request to the Sui RPC failed.", EXIT_CODES.NETWORK_FAILURE, {
      cause: error,
    });
  }

  if (error instanceof SuiHTTPStatusError) {
    return new CliError("Sui RPC returned an unexpected HTTP status.", EXIT_CODES.NETWORK_FAILURE, {
      cause: error,
      details: {
        status: String(error.status),
      },
    });
  }

  if (error instanceof JsonRpcError) {
    return new CliError("Sui RPC returned an RPC error.", EXIT_CODES.PROVIDER_FAILURE, {
      cause: error,
      details: {
        code: String(error.code),
      },
    });
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new CliError("Sui RPC request timed out.", EXIT_CODES.NETWORK_FAILURE, {
      cause: error,
    });
  }

  return new CliError("Unexpected Sui client failure.", EXIT_CODES.UNKNOWN_FAILURE, {
    cause: error instanceof Error ? error : undefined,
  });
}
