import { NextFunction } from "express";
import { GeneralError } from "../errors/general.error";
import express from "express";
export function handleErrors(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: NextFunction
) {
  console.log("Error Handling Middleware called");
  console.log("Path: ", req.path);
  console.log("method: ", req.method);
  console.error("Error: ", err);

  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message,
  });
}
