import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

export const EnrollmentRepository = {

  create: async (studentId: string, courseId: string) => {
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existing) {
      throw new Error("Already enrolled");
    }

    return prisma.enrollment.create({
      data: {
        studentId,
        courseId,
      },
    });
  },

  update: async (
    id: string,
    data: any,
    userId: string,
    userRole: Role
  ) => {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    if (
      userRole !== Role.ADMIN &&
      enrollment.studentId !== userId
    ) {
      throw new Error("Not allowed");
    }

    return prisma.enrollment.update({
      where: { id },
      data,
    });
  },

};