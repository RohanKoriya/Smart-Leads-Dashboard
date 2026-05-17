import { Request, Response, NextFunction } from "express";

export const validateLead = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, email, source } = req.body;

  if (!name || !email || !source) {
    res.status(400).json({
      success: false,
      message: "Name, email and source are required",
    });

    return;
  }

  next();
};
