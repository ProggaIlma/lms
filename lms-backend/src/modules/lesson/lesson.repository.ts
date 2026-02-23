import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";
import { log } from "console";
const prisma = new PrismaClient();

export const LessonRepository = {
  create: (data: any, user: any) => prisma.lesson.create({ data: { ...data, userId: user.id } }),

  update: async (id: string, data: any, userRole: Role, userId: string) => {
    const lesson = await prisma.lesson.findFirst({
      where: { id },
      include: { course: true },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    if (userRole === Role.INSTRUCTOR && lesson.course.instructorId !== userId) {
      throw new Error("You cannot modify this lesson");
    }

    return prisma.lesson.update({
      where: { id },
      data,
    });
  },
 delete: async (id: string, userRole: Role, userId: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!lesson || lesson.course.isDeleted) {
    throw new Error("Lesson not found");
  }

  if (
    userRole === Role.INSTRUCTOR &&
    lesson.course.instructorId !== userId
  ) {
    throw new Error("You cannot delete this lesson");
  }

  return prisma.lesson.delete({ where: { id } });
},

  findByCourse: (courseId: string) =>
    prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
    }),
};
