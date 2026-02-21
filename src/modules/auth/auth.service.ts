import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { findUserByEmail, createUser } from "./auth.repository";
import { LoginInput } from "./auth.dto";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

import { RegisterInput } from "./auth.dto";

export async function register(data: RegisterInput, creatorRole?: Role) {
  const { name, email, password } = data;
  let role = data.role;

  if (!creatorRole) {
    role = Role.STUDENT;
  } else {
    if (role === Role.ADMIN && creatorRole !== Role.SUPER_ADMIN) {
      throw new Error("Only SUPER_ADMIN can create ADMIN");
    }

    if (role === Role.INSTRUCTOR && creatorRole !== Role.ADMIN) {
      throw new Error("Only ADMIN can create INSTRUCTOR");
    }

    if (role === Role.SUPER_ADMIN) {
      throw new Error("Cannot create SUPER_ADMIN via API");
    }
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role: role ?? Role.STUDENT,
  });

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}


export async function login(data: LoginInput) {
  const { email, password } = data;
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated");
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}
