import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/admin-only",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin!" });
  }
);

export default router;
