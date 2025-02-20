import { z } from "zod";

export const listenSchema = z.object({
  query: z.object({
    ownerId: z.string({
      required_error: "Owner ID is required",
    }),
    walletId: z.string({
      required_error: "Wallet ID is required",
    }),
  }),
});

export type ListenInput = z.TypeOf<typeof listenSchema>["query"];
