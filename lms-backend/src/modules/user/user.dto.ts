import { z } from "zod";

export const userQuerySchema = z.object({
  search: z.string().optional(),
  role:   z.enum(["SUPER_ADMIN", "ADMIN", "INSTRUCTOR", "STUDENT"]).optional(),
  page:   z.coerce.number().int().positive().default(1),
  limit:  z.coerce.number().int().positive().max(100).default(10),
});

export const updateUserSchema = z.object({
  isActive: z.boolean(),
});

export type UserQueryDTO    = z.infer<typeof userQuerySchema>;
export type UpdateUserDTO   = z.infer<typeof updateUserSchema>;