import { Request, Response } from "express";
import { CourseService } from "./course.service";

export const CourseController = {
  async create(req: Request, res: Response) {
    const course = await CourseService.createCourse(req.body);
    res.status(201).json(course);
  },

  async update(req: Request, res: Response) {
    const course = await CourseService.updateCourse(
      req.params.id as string,
      req.body
    );
    res.json(course);
  },

  async delete(req: Request, res: Response) {
    await CourseService.deleteCourse(req.params.id as string);
    res.json({ message: "Course archived successfully" });
  },

  async getOne(req: Request, res: Response) {
    const course = await CourseService.getCourse(req.params.id as string);
    res.json(course);
  },

  async getAll(req: Request, res: Response) {
    const courses = await CourseService.getAllCourses();
    res.json(courses);
  },
};