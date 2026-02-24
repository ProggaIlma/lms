import { Category } from "./category.types";
import { User } from "./auth.types";

export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "DROPPED";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  isFree: boolean;
  status: CourseStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  instructorId: string;
  instructor?: Pick<User, "userId" | "name" | "email">;
  categoryId?: string | null;
  category?: Category | null;
  _count?: { lessons: number; enrollments: number };
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  isPreview: boolean;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  studentId: string;
  courseId: string;
  course?: Course;
}

export interface CourseQueryParams {
  search?: string;
  status?: CourseStatus;
  categoryId?: string;
  isFree?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "price";
  sortOrder?: "asc" | "desc";
  cursor?: string;
}
