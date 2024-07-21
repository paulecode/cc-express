import z from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(4)
    .max(16)
    .transform((x) => x.toLowerCase()),
  password: z.string().min(6).max(64),
});