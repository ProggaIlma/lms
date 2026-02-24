import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { UserService } from "./user.service";
import { userQuerySchema, updateUserSchema } from "./user.dto";

const userService = new UserService();

export class UserController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query  = userQuerySchema.parse(req.query);
      const result = await userService.getAllUsers(query);

      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateActive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id }        = req.params as { id: string };
      const body      = updateUserSchema.parse(req.body);
      const requestorRole = req.user!.role;

      const user = await userService.toggleUserActive(id, body.isActive, requestorRole);

      res.status(200).json({
        success: true,
        message: `User ${body.isActive ? "activated" : "suspended"} successfully`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}