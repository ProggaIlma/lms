import { login, register } from "./auth.service";
import { Request, Response } from "express";
import { RegisterDTO, LoginDTO } from "./auth.dto";
import { findUserById } from "./auth.repository";
import { Role } from "@prisma/client";
import { AuthRequest } from "@middlewares/auth.middleware";
export const loginController = async (req: Request, res: Response) => {
  try {
    const validated = LoginDTO.parse(req.body);
    const data = await login(validated);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const registerController = async (
  req: AuthRequest, 
  res: Response,
) => {
  try {
    const validated = RegisterDTO.parse(req.body);
    const requestedRole = validated.role;
   
    console.log(req?.user?.role);
    if (!req.user) {
      if (requestedRole && requestedRole !== Role.STUDENT) {
        return res.status(403).json({
          error: "Public registration can only create STUDENT",
        });
      }

      const data = await register(validated, undefined);
      return res.json(data);
    }

    const data = await register(validated, req.user.role);
    return res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const getMeController = async (req: AuthRequest, res: Response) => {
  try {
    const user = await findUserById(req.user!.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};