import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = (data: { name: string; email: string; password: string; role: Role }) => {
  return prisma.user.create({
    data,
  });
};
export const findUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id:        true,
      name:      true,
      email:     true,
      role:      true,
      isActive:  true,
      createdAt: true,
    },
  });
};