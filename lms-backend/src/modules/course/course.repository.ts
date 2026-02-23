import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const CourseRepository = {
  create: (data: any) => prisma.course.create({ data }),

  update: (id: string, data: any) =>
    prisma.course.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.course.update({
      where: { id },
      data: { isDeleted: true },
    }),

  findById: (id: string) =>
    prisma.course.findUnique({
      where: { id },
      include: { lessons: true, enrollments: true },
    }),

  findAll: () =>
    prisma.course.findMany({
      where: { isDeleted: false },
      include: { category: true, instructor: true },
    }),
};