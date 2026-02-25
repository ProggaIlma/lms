import { CourseRepository } from "./course.repository";
import { CreateCourseDTO, UpdateCourseDTO, CourseQueryDTO } from "./course.dto";
import { AppError } from "../../utils/AppError";

export const CourseService = {
  async createCourse(data: CreateCourseDTO) {
    return CourseRepository.create(data);
  },

  async getCourse(id: string) {
    const course = await CourseRepository.findById(id);

    // ! throw 404 if not found
    if (!course) throw new AppError("Course not found", 404);

    return course;
  },

  async getAllCourses(params: CourseQueryDTO) {
    const page  = params.page  ?? 1;
    const limit = params.limit ?? 10;

    const [total, courses] = await CourseRepository.findAll({
      search:     params.search,
      status:     params.status,
      categoryId: params.categoryId,
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

  async updateCourse(id: string, data: UpdateCourseDTO) {
    // ! throw 404 if course doesn't exist
    const existing = await CourseRepository.findById(id);
    if (!existing) throw new AppError("Course not found", 404);

    return CourseRepository.update(id, data);
  },

  async deleteCourse(id: string) {
    // ! throw 404 if course doesn't exist
    const existing = await CourseRepository.findById(id);
    if (!existing) throw new AppError("Course not found", 404);

    return CourseRepository.delete(id);
  },
};