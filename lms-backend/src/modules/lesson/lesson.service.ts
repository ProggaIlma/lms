import { LessonRepository } from "./lesson.repository";
import { CreateLessonDTO, UpdateLessonDTO } from "./lesson.dto";
import { Role } from "@prisma/client";

export const LessonService = {
  createLesson: (data: CreateLessonDTO) => LessonRepository.create(data),

  updateLesson: (id: string, data: UpdateLessonDTO, userRole: Role, userId: string) => LessonRepository.update(id, data, userRole, userId),

  deleteLesson: (id: string, userRole: Role, userId: string) => LessonRepository.delete(id, userRole, userId),

  getCourseLessons: (courseId: string) => LessonRepository.findByCourse(courseId),
};
