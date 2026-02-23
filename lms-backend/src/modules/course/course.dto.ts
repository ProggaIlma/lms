export interface CreateCourseDTO {
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  isFree?: boolean;
 
  instructorId: string;
  createdById?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId?: string;
  updatedById?: string;
}

