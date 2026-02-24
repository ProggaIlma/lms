import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["INSTRUCTOR", "STUDENT"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
});

export const courseSchema = z.object({
  title:       z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId:  z.string().optional(),
  price:       z.number().min(0, "Price must be 0 or more"),
  isFree:      z.boolean(),
});

export const lessonSchema = z.object({
  title:     z.string().min(2, "Title must be at least 2 characters"),
  content:   z.string().min(10, "Content must be at least 10 characters"),
  videoUrl:  z.string().url("Enter a valid URL").optional().or(z.literal("")),
  order:     z.number().int().positive("Order must be a positive number"),
  isPreview: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type LessonFormData = z.infer<typeof lessonSchema>;
