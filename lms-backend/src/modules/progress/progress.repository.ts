import { AppError } from "../../utils/AppError";

import { prisma } from "../../config/prisma";

export const ProgressRepository = {
  markComplete: async (studentId: string, lessonId: string, courseId: string) => {
    // ! check student is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (!enrollment) throw new AppError("You are not enrolled in this course", 403);

    const progress = await prisma.lessonProgress.upsert({
      where: { studentId_lessonId: { studentId, lessonId } },
      create: { studentId, lessonId, courseId, isCompleted: true, completedAt: new Date() },
      update: { isCompleted: true, completedAt: new Date() },
    });

    const [totalLessons, completedLessons] = await prisma.$transaction([
      prisma.lesson.count({ where: { courseId } }),
      prisma.lessonProgress.count({
        where: { studentId, courseId, isCompleted: true },
      }),
    ]);

    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await prisma.enrollment.update({
      where: { studentId_courseId: { studentId, courseId } },
      data: {
        progress: percentage,
        ...(percentage === 100 && { status: "COMPLETED" }),
      },
    });

    return { progress: percentage, lessonProgress: progress };
  },

  markIncomplete: async (studentId: string, lessonId: string, courseId: string) => {
    await prisma.lessonProgress.upsert({
      where: { studentId_lessonId: { studentId, lessonId } },
      create: { studentId, lessonId, courseId, isCompleted: false },
      update: { isCompleted: false, completedAt: null },
    });

    const [totalLessons, completedLessons] = await prisma.$transaction([
      prisma.lesson.count({ where: { courseId } }),
      prisma.lessonProgress.count({
        where: { studentId, courseId, isCompleted: true },
      }),
    ]);

    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await prisma.enrollment.update({
      where: { studentId_courseId: { studentId, courseId } },
      data: { progress: percentage },
    });

    return { progress: percentage };
  },

  getCourseProgress: async (studentId: string, courseId: string) => {
    const [enrollment, lessonProgress] = await prisma.$transaction([
      prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId, courseId } },
      }),
      prisma.lessonProgress.findMany({
        where: { studentId, courseId },
      }),
    ]);

    if (!enrollment) throw new AppError("Not enrolled in this course", 403);

    return {
      progress: enrollment.progress,
      status: enrollment.status,
      lessonProgress,
    };
  },
};
