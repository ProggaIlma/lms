import { Role } from "@prisma/client";

import { prisma } from "../../config/prisma";

export const LessonRepository = {
  create: (data: any) =>
    prisma.lesson.create({
      data: {
        title:     data.title,
        content:   data.content,
        videoUrl:  data.videoUrl  || null,
        order:     data.order,
        isPreview: data.isPreview ?? false,
        courseId:  data.courseId,           // ✅ from URL param
        createdById: data.createdById ?? null,
        updatedById: data.updatedById ?? null,
      },
    }),

  update: async (id: string, data: any, userRole: Role, userId: string) => {
    const lesson = await prisma.lesson.findFirst({
      where:   { id },
      include: { course: true },
    });

    if (!lesson) throw new Error("Lesson not found");

    if (userRole === Role.INSTRUCTOR && lesson.course.instructorId !== userId) {
      throw new Error("You cannot modify this lesson");
    }

    return prisma.lesson.update({ where: { id }, data });
  },

  delete: async (id: string, userRole: Role, userId: string) => {
    const lesson = await prisma.lesson.findUnique({
      where:   { id },
      include: { course: true },
    });

    if (!lesson || lesson.course.isDeleted) throw new Error("Lesson not found");

    if (userRole === Role.INSTRUCTOR && lesson.course.instructorId !== userId) {
      throw new Error("You cannot delete this lesson");
    }

    return prisma.lesson.delete({ where: { id } });
  },

  findByCourse: (courseId: string) =>
    prisma.lesson.findMany({
      where:   { courseId },
      orderBy: { order: "asc" },
    }),
};