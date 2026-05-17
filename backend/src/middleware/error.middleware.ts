import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/ApiError";

type CustomError = Error & {
  statusCode?: number;
  value?: unknown;
};

export const errorMiddleware = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;

  let message = "Internal Server Error";

  /*
    CUSTOM API ERROR
  */
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  /*
    MONGOOSE CAST ERROR
  */
  if (err.name === "CastError") {
    statusCode = 400;

    message = `Invalid ID: ${String(err.value)}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
