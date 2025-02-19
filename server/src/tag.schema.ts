import { z } from "zod";

export const createTagSchema = z.object({
  body: z.object({
    ownerId: z.string({
      required_error: "Owner ID is required",
    }),
    walletId: z.string({
      required_error: "Wallet ID is required",
    }),
    tag: z.string({
      required_error: "Tag is required",
    }),
  }),
});

export const params = z.object({
  ownerId: z.string(),
  walletId: z.string(),
});

export const updateTagSchema = z.object({
  params,
  body: z
    .object({
      ownerId: z.string({
        required_error: "Owner ID is required",
      }),
      walletId: z.string({
        required_error: "Wallet ID is required",
      }),
      newTag: z.string({
        required_error: "New tag is required",
      }),
    })
    .partial(),
});

export const filterQuery = z.object({
  limit: z.number().default(1),
  page: z.number().default(10),
});

export type ParamsInput = z.TypeOf<typeof params>;
export type FilterQueryInput = z.TypeOf<typeof filterQuery>;
export type CreateTagInput = z.TypeOf<typeof createTagSchema>["body"];
export type UpdateTagInput = z.TypeOf<typeof updateTagSchema>;
