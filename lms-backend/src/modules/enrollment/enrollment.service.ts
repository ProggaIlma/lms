import { EnrollmentRepository } from "./enrollment.repository";
import { EnrollmentStatus, Role } from "@prisma/client";

export const EnrollmentService = {
  enroll: async (data: { studentId: string; courseId: string }) => {
    return EnrollmentRepository.create(data.studentId, data.courseId);
  },

   getMyEnrollments: async (studentId: string) => { 
    return EnrollmentRepository.findByStudent(studentId);
  },

  updateStatus: async (
    id: string,
    status: EnrollmentStatus,
    userId: string,
    userRole: Role
  ) => {
    return EnrollmentRepository.update(id, { status }, userId, userRole);
  },
};