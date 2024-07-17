import { NextFunction, Response, Request } from "express";
import { logger } from "../utils/logger";

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.trace(`${req.method} ${req.url}`);
  if (Object.keys(req.body).length > 0)
    logger.trace(JSON.stringify(req.body, null, 4));
  next();
}
