import {  Role } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const EnrollmentRepository = {
  create: async (studentId: string, courseId: string) => {
    const existing = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });

    if (existing) throw new Error("Already enrolled in this course");

    return prisma.enrollment.create({
      data: { studentId, courseId },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, name: true } },
            category:   { select: { id: true, name: true } },
          },
        },
      },
    });
  },

  findByStudent: async (studentId: string) => {
    return prisma.enrollment.findMany({
      where:   { studentId },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, name: true } },
            category:   { select: { id: true, name: true } },
            _count:     { select: { lessons: true } },
          },
        },
      },
    });
  },

  update: async (id: string, data: any, userId: string, userRole: Role) => {
    const enrollment = await prisma.enrollment.findUnique({ where: { id } });

    if (!enrollment) throw new Error("Enrollment not found");

    if (userRole !== Role.ADMIN && enrollment.studentId !== userId) {
      throw new Error("Not allowed");
    }

    return prisma.enrollment.update({ where: { id }, data });
  },
};