import { z } from "zod";

export const decodedTokenSchema = z.object({
  sub: z.coerce.number(),
});
