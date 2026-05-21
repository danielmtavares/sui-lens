import { afterEach, describe, expect, it, vi } from "vitest";

type CreateClientMock = () => {
  network: "mainnet";
};

type FetchAddressMock = () => Promise<{
  balance: {
    coinObjectCount: number;
    coinType: string;
    lockedBalance: Record<string, string>;
    totalBalance: string;
  };
  ownedObjects: {
    data: Array<{
      data: {
        objectId: string;
        type: string;
      };
    }>;
    hasNextPage: false;
    nextCursor: null;
  };
  recentTransactions: {
    data: Array<{
      digest: string;
    }>;
    hasNextPage: false;
    nextCursor: null;
  };
}>;

vi.mock("../src/api/client.js", () => ({
  createSuiClient: vi.fn<CreateClientMock>(() => ({
    network: "mainnet",
  })),
  fetchAddressData: vi.fn<FetchAddressMock>(async () => ({
    balance: {
      coinObjectCount: 2,
      coinType: "0x2::sui::SUI",
      lockedBalance: {},
      totalBalance: "1234000000",
    },
    ownedObjects: {
      data: [
        {
          data: {
            objectId: "0xaaa",
            type: "0x2::coin::Coin<0x2::sui::SUI>",
          },
        },
      ],
      hasNextPage: false,
      nextCursor: null,
    },
    recentTransactions: {
      data: [
        {
          digest: "tx-1",
        },
      ],
      hasNextPage: false,
      nextCursor: null,
    },
  })),
}));

import { runAddressCommand } from "../src/commands/address.js";

describe("runAddressCommand", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the fetched address summary", async () => {
    const writeSpy = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    await runAddressCommand("0x1234", {
      format: "table",
      network: "mainnet",
    });

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy.mock.calls[0]?.[0]).toContain("SUI Balance: 1.234");
    expect(writeSpy.mock.calls[0]?.[0]).toContain("Owned Objects: 1");
  });
});
