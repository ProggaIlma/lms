import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Your ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

if (err instanceof ZodError) {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    })),
  });
}

  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: `Already exists: ${err.meta?.target}`,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};