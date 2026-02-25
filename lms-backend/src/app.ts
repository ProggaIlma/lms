import "module-alias/register";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./modules/auth/auth.routes";
import courseRouter from "./modules/course/course.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import enrollmentRouter from "./modules/enrollment/enrollment.routes";
import categoryRouter from "./modules/category/category.routes";
import userRouter from "./modules/user/user.routes";
import { errorHandler } from "./middleware/error.middleware";
import progressRouter from "./modules/progress/progress.routes";
import { logger } from "./middleware/logger.middleware";
import path from "path";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

app.use(logger);

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/analytics", analyticsRoutes);
app.use("/api/progress", progressRouter);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
