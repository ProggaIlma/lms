export interface CreateLessonDTO {
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  isPreview?: boolean;
  courseId: string;
  createdById?: string;
}

export interface UpdateLessonDTO {
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  isPreview?: boolean;
  updatedById?: string;
}