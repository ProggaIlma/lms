import { CourseRepository } from "./course.repository";

export const CourseService = {
  async createCourse(data: any) {
    return CourseRepository.create(data);
  },

  async getCourse(id: string) {
    return CourseRepository.findById(id);
  },

  async getAllCourses(params?: {
    search?:     string;
    status?:     string;
    categoryId?: string;
    page?:       number;
    limit?:      number;
  }) {
    const page  = params?.page  ?? 1;
    const limit = params?.limit ?? 10;

    const [total, courses] = await CourseRepository.findAll({
      search:     params?.search,
      status:     params?.status,
      categoryId: params?.categoryId,
      page,
      limit,
    });

    return {
      courses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateCourse(id: string, data: any) {
    return CourseRepository.update(id, data);
  },

  async deleteCourse(id: string) {
    return CourseRepository.delete(id);
  },
};