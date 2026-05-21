import type { SupportedNetwork } from "../constants/networks.js";

export type OutputFormat = "json" | "table";

type SummaryKind = "address" | "object" | "package" | "tx";

export type SuiBalanceSummary = {
  mist: string;
  sui: string;
};

export type OwnedObjectPreview = {
  objectId: string;
  type: string | null;
};

export type AddressSummary = {
  address: string;
  balance: SuiBalanceSummary;
  kind: "address";
  network: SupportedNetwork;
  ownedObjects: {
    count: number;
    items: OwnedObjectPreview[];
  };
  recentTransactions: {
    count: number | null;
    digests: string[];
  };
};

export type ObjectSummary = {
  digest: string | null;
  kind: "object";
  network: SupportedNetwork;
  objectId: string;
  owner: string | null;
  storageRebate: string | null;
  type: string | null;
  version: string | null;
};

export type TransactionSummary = {
  changedObjectsCount: number | null;
  digest: string;
  gas: {
    budget: string | null;
    owner: string | null;
    paymentCount: number | null;
    total: string | null;
  };
  kind: "tx";
  network: SupportedNetwork;
  sender: string | null;
  status: "failure" | "success" | "unknown";
  summary: string | null;
  timestamp: string | null;
};

export type PackageSummary = {
  kind: "package";
  modules: string[];
  network: SupportedNetwork;
  packageId: string;
  upgradeCapId: string | null;
  version: string | null;
};

export type SuiSummary = AddressSummary | ObjectSummary | PackageSummary | TransactionSummary;

export type SummaryByKind = {
  address: AddressSummary;
  object: ObjectSummary;
  package: PackageSummary;
  tx: TransactionSummary;
};

export type JsonOutputEnvelope<TKind extends SummaryKind = SummaryKind> = {
  data: SummaryByKind[TKind];
  kind: TKind;
};
