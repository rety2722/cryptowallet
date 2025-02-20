import { z } from "zod";

export const transactionParams = z.object({
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
});

export const replyTransactionParams = z.object({
  transactions: z.array(transactionParams),
});

export const inputParams = z.object({
  ownerId: z.string(),
  limit: z.number().default(15),
  walletId: z.string(),
  depth: z.number().default(100000),
});

export const ResponseTransactionParams = z.object({
  transactionHash: z.string(),
});

export type ResponseTransactionSchema = z.TypeOf<
  typeof ResponseTransactionParams
>;
export type InputTransactionSchema = z.TypeOf<typeof inputParams>;
export type ReplyTransactionSchema = z.TypeOf<typeof replyTransactionParams>;
export type TransactionSchema = z.TypeOf<typeof transactionParams>;
