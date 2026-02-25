import { z } from "zod";

export const markLessonSchema = z.object({
  lessonId: z.string().uuid(),
  courseId: z.string().uuid(),
});

export type MarkLessonDTO = z.infer<typeof markLessonSchema>;
