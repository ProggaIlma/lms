export interface CreateEnrollmentDTO {
  studentId: string;
  courseId: string;
  createdById?: string;
  updatedById?: string;

}

export interface UpdateEnrollmentDTO {
  status?: "ACTIVE" | "COMPLETED" | "DROPPED";
  updatedById?: string;
}