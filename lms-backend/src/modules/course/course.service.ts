import { CourseRepository } from "./course.repository";
import { CreateCourseDTO } from "./course.dto";

export const CourseService = {
  async createCourse(data: CreateCourseDTO) {
    return CourseRepository.create(data);
  },

  async updateCourse(id: string, data: CreateCourseDTO) {
    return CourseRepository.update(id, data);
  },

  async deleteCourse(id: string) {
    return CourseRepository.delete(id);
  },

  async getCourse(id: string) {
    return CourseRepository.findById(id);
  },

  async getAllCourses() {
    return CourseRepository.findAll();
  },
};