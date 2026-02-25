import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { CourseService } from "./course.service";
import {
  createCourseSchema,
  updateCourseSchema,
  courseQuerySchema,
} from "./course.dto";

export const CourseController = {
  async create(req: AuthRequest, res: Response) {
    try {
      // * validate and parse body
      const parsed = createCourseSchema.parse({
        ...req.body,
        instructorId: req.user!.userId,
        thumbnail: req.file ? req.file.path : null,
        isFree: req.body.isFree === "true" || req.body.isFree === true,
        price:  parseFloat(req.body.price) || 0,
      });

      const course = await CourseService.createCourse(parsed);
      res.status(201).json({ success: true, data: course });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      // * validate and parse body
      const parsed = updateCourseSchema.parse({
        ...req.body,
        ...(req.file && { thumbnail: req.file ? req.file.path : null }),
        isFree: req.body.isFree !== undefined
          ? req.body.isFree === "true" || req.body.isFree === true
          : undefined,
        price: req.body.price !== undefined
          ? parseFloat(req.body.price)
          : undefined,
      });
    
      const course = await CourseService.updateCourse(
        req.params.id as string,
        parsed
      );
      res.json({ success: true, data: course });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await CourseService.deleteCourse(req.params.id as string);
      res.json({ success: true, message: "Course archived successfully" });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getOne(req: AuthRequest, res: Response) {
    try {
      const course = await CourseService.getCourse(req.params.id as string);
      res.json({ success: true, data: course });
    } catch (err: any) {
      const status = err.statusCode ?? 400;
      res.status(status).json({ success: false, message: err.message });
    }
  },

  async getAll(req: AuthRequest, res: Response) {
    try {
      // * validate query params
      const query  = courseQuerySchema.parse(req.query);
      const result = await CourseService.getAllCourses(query);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};