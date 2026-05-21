import { afterEach, describe, expect, it, vi } from "vitest";

type CreateClientMock = () => {
  network: "mainnet";
};

type FetchObjectMock = () => Promise<{
  data: {
    digest: string;
    objectId: string;
    owner: {
      AddressOwner: string;
    };
    storageRebate: string;
    type: string;
    version: string;
  };
}>;

vi.mock("../src/api/client.js", () => ({
  createSuiClient: vi.fn<CreateClientMock>(() => ({
    network: "mainnet",
  })),
  fetchObjectData: vi.fn<FetchObjectMock>(async () => ({
    data: {
      digest: "digest-1",
      objectId: "0x1234abcd",
      owner: {
        AddressOwner: "0x9999",
      },
      storageRebate: "42",
      type: "0x2::example::Thing",
      version: "7",
    },
  })),
}));

import { runObjectCommand } from "../src/commands/object.js";

describe("runObjectCommand", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the fetched object summary", async () => {
    const writeSpy = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    await runObjectCommand("0x1234abcd", {
      format: "table",
      network: "mainnet",
    });

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy.mock.calls[0]?.[0]).toContain("Object ID");
    expect(writeSpy.mock.calls[0]?.[0]).toContain("Storage Rebate: 42");
  });
});
