import { Response } from "express";

export const ErrorResponse = (res: Response, code: number, error: any) => {
  console.log(error);
  res.status(code).json({
    error: error.message || "Server Error",
  });
};
