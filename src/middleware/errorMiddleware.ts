import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export function zodErrorMiddleware(
  err: ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    logger.error(`Error occured on ${req.path}`);
    logger.error(err.issues);
    return res.status(401).json(err.issues);
  }
  res.status(400).json({ rezo: "ja lol ey" });
}
