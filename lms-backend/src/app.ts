import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./modules/auth/auth.routes";
import courseRouter from "./modules/course/course.routes";
import lessonRouter from "./modules/lesson/lesson.routes";
import enrollmentRouter from "./modules/enrollment/enrollment.routes";
import { errorHandler } from "./middleware/error.middleware";
import testRouter from "./routes/test.routes";

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

app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});


app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/test", testRouter);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
