import { Request, Response, NextFunction } from "express";

const colors = {
  reset:  "\x1b[0m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  cyan:   "\x1b[36m",
  gray:   "\x1b[90m",
};

const getStatusColor = (status: number) => {
  if (status >= 500) return colors.red;
  if (status >= 400) return colors.yellow;
  if (status >= 200) return colors.green;
  return colors.gray;
};

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":    return colors.cyan;
    case "POST":   return colors.green;
    case "PUT":    return colors.yellow;
    case "PATCH":  return colors.yellow;
    case "DELETE": return colors.red;
    default:       return colors.gray;
  }
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration    = Date.now() - start;
    const method      = req.method;
    const url         = req.originalUrl;
    const status      = res.statusCode;
    const timestamp   = new Date().toISOString().replace("T", " ").split(".")[0];

    const methodColor  = getMethodColor(method);
    const statusColor  = getStatusColor(status);

    console.log(
      `${colors.gray}[${timestamp}]${colors.reset} ` +
      `${methodColor}${method.padEnd(7)}${colors.reset} ` +
      `${url.padEnd(40)} ` +
      `${statusColor}${status}${colors.reset} ` +
      `${colors.gray}${duration}ms${colors.reset}`
    );
  });

  next();
};