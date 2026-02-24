import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: Role };
    req.user = decoded; 

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}


export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header) return next(); // allow public access

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    // authenticate() must run before authorize()
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: no user found on request",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of [${allowedRoles.join(", ")}]`,
      });
    }

    next();
  };
}