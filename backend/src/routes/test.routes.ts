import express, { Response } from "express";

import { protect } from "../middleware/auth.middleware";
import { AuthRequest } from "../interfaces/express.interface";

const router = express.Router();

router.get("/protected", protect, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
