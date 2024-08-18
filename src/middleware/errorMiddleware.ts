import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function ErrorMiddleware<ErrorT>(
  err: ErrorT,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    logger.error(`Zod error occured on ${req.path}`);
    logger.error(err.issues);

    return res.status(402).json(err.issues);
  } else if (err instanceof PrismaClientKnownRequestError) {
    logger.error(`Prisma known request error on ${req.path}`);
    logger.error(`${err.code}: ${err.name}`);

    return res.status(400).json(err.code);
  } else if (!(err instanceof Error)) {
    logger.warn(
      "Error landed here without being an error, unhandled exception!",
    );
    logger.warn((err as Error).message);
  }
  logger.error((err as Error).message);
  return res.status(400).json({ "Unknown Error": (err as Error).message });
}
