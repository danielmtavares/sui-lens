import { afterEach, describe, expect, it, vi } from "vitest";

type CreateClientMock = () => {
  network: "mainnet";
};

type FetchPackageMock = () => Promise<{
  modules: {
    router: {
      address: string;
      exposedFunctions: Record<string, never>;
      fileFormatVersion: number;
      friends: [];
      name: string;
      structs: Record<string, never>;
    };
    vault: {
      address: string;
      exposedFunctions: Record<string, never>;
      fileFormatVersion: number;
      friends: [];
      name: string;
      structs: Record<string, never>;
    };
  };
  object: {
    data: {
      digest: string;
      objectId: string;
      type: string;
      version: string;
    };
  };
}>;

vi.mock("../src/api/client.js", () => ({
  createSuiClient: vi.fn<CreateClientMock>(() => ({
    network: "mainnet",
  })),
  fetchPackageData: vi.fn<FetchPackageMock>(async () => ({
    modules: {
      router: {
        address: "0x2",
        exposedFunctions: {},
        fileFormatVersion: 6,
        friends: [],
        name: "router",
        structs: {},
      },
      vault: {
        address: "0x2",
        exposedFunctions: {},
        fileFormatVersion: 6,
        friends: [],
        name: "vault",
        structs: {},
      },
    },
    object: {
      data: {
        digest: "digest-1",
        objectId: "0xface",
        type: "package",
        version: "3",
      },
    },
  })),
}));

import { runPackageCommand } from "../src/commands/package.js";

describe("runPackageCommand", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the fetched package summary", async () => {
    const writeSpy = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    await runPackageCommand("0xface", {
      format: "table",
      network: "mainnet",
    });

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy.mock.calls[0]?.[0]).toContain("Package ID");
    expect(writeSpy.mock.calls[0]?.[0]).toContain("Modules: router, vault");
  });
});
