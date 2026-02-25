import { Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma";

export const CourseRepository = {
  create: (data: Prisma.CourseUncheckedCreateInput) =>
    prisma.course.create({
      data,
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        category:   { select: { id: true, name: true } },
      },
    }),

  update: (id: string, data: Prisma.CourseUncheckedUpdateInput) =>
    prisma.course.update({
      where: { id },
      data,
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        category:   { select: { id: true, name: true } },
      },
    }),

  delete: (id: string) =>
    prisma.course.update({
      where: { id },
      data:  { isDeleted: true, status: "ARCHIVED" },
    }),

  findById: (id: string) =>
    prisma.course.findFirst({
      where:   { id, isDeleted: false },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        category:   { select: { id: true, name: true } },
        lessons:    { orderBy: { order: "asc" } },
        _count:     { select: { lessons: true, enrollments: true } },
      },
    }),

  findAll: (params: {
    search?:     string;
    status?:     string;
    categoryId?: string;
    page:        number;
    limit:       number;
  }) => {
    const { search, status, categoryId, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {
      isDeleted: false,
      ...(search     && { title:      { contains: search, mode: "insensitive" } }),
      ...(status     && { status:     status as any }),
      ...(categoryId && { categoryId }),
    };

    return prisma.$transaction([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { createdAt: "desc" },
        include: {
          instructor: { select: { id: true, name: true, email: true } },
          category:   { select: { id: true, name: true } },
          _count:     { select: { lessons: true, enrollments: true } },
        },
      }),
    ]);
  },
};