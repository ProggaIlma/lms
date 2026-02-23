import { LessonRepository } from "./lesson.repository";

export const LessonService = {
  createLesson: (data: any, user: any) => LessonRepository.create(data, user),

updateLesson: (id: string, data: any, userRole: any, userId: string) =>
  LessonRepository.update(id, data, userRole, userId),

deleteLesson: (id: string, userRole: any, userId: string) =>
  LessonRepository.delete(id, userRole, userId),

  getCourseLessons: (courseId: string) =>
    LessonRepository.findByCourse(courseId),
};