import { z } from "zod";
import { Role } from "@prisma/client";

export const RegisterDTO = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role).optional()
});

export type RegisterInput = z.infer<typeof RegisterDTO>;

export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type LoginInput = z.infer<typeof LoginDTO>;