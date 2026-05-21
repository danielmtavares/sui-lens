import { afterEach, describe, expect, it, vi } from "vitest";

type CreateClientMock = () => {
  network: "mainnet";
};

type FetchTransactionMock = () => Promise<{
  digest: string;
  effects: {
    messageVersion: "v1";
    status: {
      status: "success";
    };
    executedEpoch: string;
    transactionDigest: string;
    gasUsed: {
      computationCost: string;
      storageCost: string;
      storageRebate: string;
      nonRefundableStorageFee: string;
    };
    gasObject: {
      owner: {
        AddressOwner: string;
      };
      reference: {
        objectId: string;
        version: string;
        digest: string;
      };
    };
  };
  timestampMs: string;
  transaction: {
    data: {
      messageVersion: "v1";
      sender: string;
      gasData: {
        budget: string;
        owner: string;
        payment: Array<{
          objectId: string;
          version: string;
          digest: string;
        }>;
        price: string;
      };
      transaction: {
        kind: "ProgrammableTransaction";
        inputs: [];
        transactions: Array<{
          MoveCall: {
            package: string;
            module: string;
            function: string;
          };
        }>;
      };
    };
    txSignatures: [];
  };
  objectChanges: Array<Record<string, never>>;
}>;

vi.mock("../src/api/client.js", () => ({
  createSuiClient: vi.fn<CreateClientMock>(() => ({
    network: "mainnet",
  })),
  fetchTransactionData: vi.fn<FetchTransactionMock>(async () => ({
    digest: "4jA6v7fLQx6oA2KpN8rTsW1b",
    effects: {
      messageVersion: "v1",
      status: {
        status: "success",
      },
      executedEpoch: "420",
      transactionDigest: "4jA6v7fLQx6oA2KpN8rTsW1b",
      gasUsed: {
        computationCost: "1000",
        storageCost: "200",
        storageRebate: "50",
        nonRefundableStorageFee: "0",
      },
      gasObject: {
        owner: {
          AddressOwner: "0xabc",
        },
        reference: {
          objectId: "0xgas",
          version: "9",
          digest: "GasDigest1",
        },
      },
    },
    timestampMs: "1716306000000",
    transaction: {
      data: {
        messageVersion: "v1",
        sender: "0xabc",
        gasData: {
          budget: "5000000",
          owner: "0xabc",
          payment: [
            {
              objectId: "0xcoin",
              version: "3",
              digest: "CoinDigest1",
            },
          ],
          price: "1000",
        },
        transaction: {
          kind: "ProgrammableTransaction",
          inputs: [],
          transactions: [
            {
              MoveCall: {
                package: "0x2",
                module: "sui",
                function: "transfer",
              },
            },
          ],
        },
      },
      txSignatures: [],
    },
    objectChanges: [{}, {}, {}, {}],
  })),
}));

import { runTransactionCommand } from "../src/commands/tx.js";

describe("runTransactionCommand", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the fetched transaction summary", async () => {
    const writeSpy = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    await runTransactionCommand("4jA6v7fLQx6oA2KpN8rTsW1b", {
      format: "table",
      network: "mainnet",
    });

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy.mock.calls[0]?.[0]).toContain("Transaction");
    expect(writeSpy.mock.calls[0]?.[0]).toContain("Status: success");
    expect(writeSpy.mock.calls[0]?.[0]).toContain("Changed Objects: 4");
  });
});
