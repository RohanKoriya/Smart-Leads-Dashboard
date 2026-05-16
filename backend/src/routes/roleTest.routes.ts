import express, { Response } from "express";

import { protect } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

import { AuthRequest } from "../interfaces/express.interface";

const router = express.Router();

router.get(
  "/admin-only",
  protect,
  authorizeRoles("admin"),
  (req: AuthRequest, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  },
);

router.get(
  "/sales-only",
  protect,
  authorizeRoles("sales"),
  (req: AuthRequest, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Welcome Sales User",
      user: req.user,
    });
  },
);

export default router;
