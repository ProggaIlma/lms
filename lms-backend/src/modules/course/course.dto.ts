import { z } from "zod";

export const createCourseSchema = z.object({
  title:       z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId:  z.string().uuid("Invalid category ID").optional().nullable(),
  price:       z.coerce.number().min(0, "Price must be 0 or more").default(0),
  isFree:      z.coerce.boolean().default(true),
  status:      z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  thumbnail:   z.string().optional().nullable(),
  instructorId: z.string().uuid("Invalid instructor ID"),
});

export const updateCourseSchema = z.object({
  title:        z.string().min(3).max(100).optional(),
  description:  z.string().min(10).optional(),
  categoryId:   z.string().uuid().optional().nullable(),
  price:        z.coerce.number().min(0).optional(),
  isFree:       z.coerce.boolean().optional(),
  status:       z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  thumbnail:    z.string().optional().nullable(),
});

export const courseQuerySchema = z.object({
  search:     z.string().optional(),
  status:     z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  categoryId: z.string().uuid().optional(),
  page:       z.coerce.number().int().positive().default(1),
  limit:      z.coerce.number().int().positive().max(100).default(10),
});

export type CreateCourseDTO = z.infer<typeof createCourseSchema>;
export type UpdateCourseDTO = z.infer<typeof updateCourseSchema>;
export type CourseQueryDTO  = z.infer<typeof courseQuerySchema>;