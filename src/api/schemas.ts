import { z } from "zod";

import { SUPPORTED_NETWORKS } from "../constants/networks.js";

const networkSchema = z.enum(SUPPORTED_NETWORKS);

export const addressSummarySchema = z.object({
  address: z.string().min(1),
  balance: z.object({
    mist: z.string().min(1),
    sui: z.string().min(1),
  }),
  kind: z.literal("address"),
  network: networkSchema,
  ownedObjects: z.object({
    count: z.number().int().nonnegative(),
    items: z.array(
      z.object({
        objectId: z.string().min(1),
        type: z.string().min(1).nullable(),
      }),
    ),
  }),
  recentTransactions: z.object({
    count: z.number().int().nonnegative().nullable(),
    digests: z.array(z.string().min(1)),
  }),
});

export const objectSummarySchema = z.object({
  digest: z.string().min(1).nullable(),
  kind: z.literal("object"),
  network: networkSchema,
  objectId: z.string().min(1),
  owner: z.string().min(1).nullable(),
  storageRebate: z.string().min(1).nullable(),
  type: z.string().min(1).nullable(),
  version: z.string().min(1).nullable(),
});

export const transactionSummarySchema = z.object({
  changedObjectsCount: z.number().int().nonnegative().nullable(),
  digest: z.string().min(1),
  gas: z.object({
    budget: z.string().min(1).nullable(),
    owner: z.string().min(1).nullable(),
    paymentCount: z.number().int().nonnegative().nullable(),
    total: z.string().min(1).nullable(),
  }),
  kind: z.literal("tx"),
  network: networkSchema,
  sender: z.string().min(1).nullable(),
  status: z.enum(["success", "failure", "unknown"]),
  summary: z.string().min(1).nullable(),
  timestamp: z.string().min(1).nullable(),
});

export const packageSummarySchema = z.object({
  kind: z.literal("package"),
  modules: z.array(z.string().min(1)),
  network: networkSchema,
  packageId: z.string().min(1),
  upgradeCapId: z.string().min(1).nullable(),
  version: z.string().min(1).nullable(),
});

export const summarySchema = z.discriminatedUnion("kind", [
  addressSummarySchema,
  objectSummarySchema,
  packageSummarySchema,
  transactionSummarySchema,
]);
