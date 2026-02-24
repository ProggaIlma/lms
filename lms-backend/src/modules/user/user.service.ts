import { UserRepository } from "./user.repository";
import { AppError } from "../../utils/AppError";
import { Role } from "@prisma/client";

const userRepository = new UserRepository();

export class UserService {
  async getAllUsers(params: {
    search?: string;
    role?: string;
    page: number;
    limit: number;
  }) {
    const { users, total } = await userRepository.findAll(params);

    return {
      users,
      pagination: {
        total,
        page:       params.page,
        limit:      params.limit,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async toggleUserActive(
    targetId: string,
    isActive: boolean,
    requestorRole: Role
  ) {
    const target = await userRepository.findById(targetId);

    if (!target) {
      throw new AppError("User not found", 404);
    }

    // Admins cannot suspend other admins or super admins
    if (
      requestorRole === Role.ADMIN &&
      (target.role === Role.ADMIN || target.role === Role.SUPER_ADMIN)
    ) {
      throw new AppError("You do not have permission to modify this user", 403);
    }

    return userRepository.updateActive(targetId, isActive);
  }
}