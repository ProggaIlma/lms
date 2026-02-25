import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { UserService } from "./user.service";
import { userQuerySchema, updateUserSchema, createAdminSchema } from "./user.dto";
import { Role } from "@prisma/client";

export class UserController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = userQuerySchema.parse(req.query);
      const result = await UserService.getAllUsers(query);
      res.status(200).json({ success: true, users: result });
    } catch (error) {
      next(error);
    }
  }

  async updateActive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const body = updateUserSchema.parse(req.body);
      const user = await UserService.toggleActive(
        id,
        body.isActive,
        req.user!.role,
        req.user!.userId, // * pass requester id
      );
      res.status(200).json({
        success: true,
        message: `User ${body.isActive ? "activated" : "suspended"} successfully`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // ! super admin only
      if (req.user!.role !== Role.SUPER_ADMIN) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
      const data = createAdminSchema.parse(req.body);
      const admin = await UserService.createAdmin(data);
      res.status(201).json({ success: true, data: admin });
    } catch (error) {
      next(error);
    }
  }
}
