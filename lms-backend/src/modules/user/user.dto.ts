// * add to user.dto.ts
import { z } from "zod";
import { Role } from "@prisma/client";

export const userQuerySchema = z.object({
  role:   z.nativeEnum(Role).optional(),
  search: z.string().optional(),
  page:   z.coerce.number().int().positive().default(1),
  limit:  z.coerce.number().int().positive().max(100).default(10),
});

export const updateUserSchema = z.object({
  isActive: z.boolean(),
});

export const createAdminSchema = z.object({
  name:     z.string().min(2).max(50),
  email:    z.string().email(),
  password: z.string().min(8),
});

export type UserQueryDTO   = z.infer<typeof userQuerySchema>;
export type UpdateUserDTO  = z.infer<typeof updateUserSchema>;
export type CreateAdminDTO = z.infer<typeof createAdminSchema>;