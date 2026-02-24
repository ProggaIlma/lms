import { Request, Response } from "express";
import { CourseService } from "./course.service";
import { AuthRequest } from "@middlewares/auth.middleware";

export const CourseController = {
  async create(req: AuthRequest, res: Response) {
  try {
    const thumbnail = req.file
      ? `/uploads/thumbnails/${req.file.filename}`
      : null;

    const course = await CourseService.createCourse({
      ...req.body,
      thumbnail,
      instructorId: req.user!.userId,
      isFree:  req.body.isFree  === "true" || req.body.isFree  === true,
      price:   parseFloat(req.body.price) || 0,
    });
    res.status(201).json({ success: true, data: course });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
},

async update(req: AuthRequest, res: Response) {
  try {
    const thumbnail = req.file
      ? `/uploads/thumbnails/${req.file.filename}`
      : undefined; // undefined = don't update thumbnail

    const course = await CourseService.updateCourse(req.params.id as string, {
      ...req.body,
      ...(thumbnail && { thumbnail }),
      isFree: req.body.isFree === "true" || req.body.isFree === true,
      price:  parseFloat(req.body.price) || 0,
    });
    res.json({ success: true, data: course });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
},
  async delete(req: Request, res: Response) {
    try {
      await CourseService.deleteCourse(req.params.id as string);
      res.json({ success: true, message: "Course archived successfully" });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const course = await CourseService.getCourse(req.params.id as string);
      if (!course) return res.status(404).json({ success: false, message: "Course not found" });
      res.json({ success: true, data: course });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { search, status, categoryId, page, limit } = req.query;
      const result = await CourseService.getAllCourses({
        search:     search     as string,
        status:     status     as string,
        categoryId: categoryId as string,
        page:       page  ? Number(page)  : 1,
        limit:      limit ? Number(limit) : 10,
      });
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};