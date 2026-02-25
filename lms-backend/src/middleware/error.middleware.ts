import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "@utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("ERROR TYPE:", err.constructor.name);
  console.log("IS AppError:", err instanceof AppError);  
 
if (err.isOperational) {
  return res.status(err.statusCode || 400).json({
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