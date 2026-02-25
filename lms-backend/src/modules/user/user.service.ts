import bcrypt from "bcryptjs";
import { UserRepository } from "./user.repository";
import { CreateAdminDTO, UpdateUserDTO } from "./user.dto";
import { AppError } from "../../utils/AppError";
import { Role } from "@prisma/client";

export const UserService = {
  getAllUsers: async (params?: { role?: Role; search?: string }) => {
    return UserRepository.findAll(params);
  },

  getUserById: async (id: string) => {
    const user = await UserRepository.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  },

  createAdmin: async (data: CreateAdminDTO) => {
    // ! check duplicate email
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new AppError("Email already in use", 400);

    const hashed = await bcrypt.hash(data.password, 10);
    return UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: Role.ADMIN,
    });
  },

  updateUser: async (id: string, data: UpdateUserDTO) => {
    return UserRepository.update(id, data);
  },

  // ! prevent super admin from being suspended
  async toggleActive(id: string, isActive: boolean, requesterRole: Role, requesterId: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new AppError("User not found", 404);

    // ! cannot modify your own account
    if (id === requesterId) {
      throw new AppError("Cannot suspend your own account", 403);
    }

    // ! cannot modify super admin
    if (user.role === Role.SUPER_ADMIN) {
      throw new AppError("Cannot modify Super Admin account", 403);
    }

    // ! admin cannot suspend other admins — only super admin can
    if (user.role === Role.ADMIN && requesterRole !== Role.SUPER_ADMIN) {
      throw new AppError("Only Super Admin can suspend Admin accounts", 403);
    }

    return UserRepository.update(id, { isActive });
  },
};
