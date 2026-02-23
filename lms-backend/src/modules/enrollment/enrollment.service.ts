import { EnrollmentRepository } from "./enrollment.repository";
import { EnrollmentStatus, Role } from "@prisma/client";

export const EnrollmentService = {

  enroll: async (data: any) => {
    return EnrollmentRepository.create(data.studentId, data.courseId);
  },

  updateStatus: async (
    id: string,
    status: EnrollmentStatus,
    userId: string,
    userRole: Role
  ) => {
    return EnrollmentRepository.update(
      id,
      { status },
      userId,
      userRole
    );
  },

};