import { Response, NextFunction } from "express";

import { AuthRequest } from "../interfaces/express.interface";

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });

        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: "Access denied",
        });

        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
};
