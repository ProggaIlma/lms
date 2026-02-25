import { z } from "zod";

export const createLessonSchema = z.object({
  title:       z.string().min(2).max(100),
  content:     z.string().min(10),
  videoUrl:    z.string().url().optional().nullable(),
  order:       z.coerce.number().int().positive(),
  isPreview:   z.coerce.boolean().default(false),
  courseId:    z.string().uuid(),
  createdById: z.string().uuid().optional().nullable(),
  updatedById: z.string().uuid().optional().nullable(),
});

export const updateLessonSchema = createLessonSchema.partial().omit({ courseId: true, createdById: true });

export type CreateLessonDTO = z.infer<typeof createLessonSchema>;
export type UpdateLessonDTO = z.infer<typeof updateLessonSchema>;