import { ProgressRepository } from "./progress.repository";
import { MarkLessonDTO } from "./progress.dto";

export const ProgressService = {
  markComplete: (studentId: string, data: MarkLessonDTO) =>
    ProgressRepository.markComplete(studentId, data.lessonId, data.courseId),

  markIncomplete: (studentId: string, data: MarkLessonDTO) =>
    ProgressRepository.markIncomplete(studentId, data.lessonId, data.courseId),

  getCourseProgress: (studentId: string, courseId: string) =>
    ProgressRepository.getCourseProgress(studentId, courseId),
};