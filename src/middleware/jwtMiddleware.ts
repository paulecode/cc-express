import { NextFunction, Request, Response } from "express";
import { verifySignature } from "../services/authService";
import { logger } from "../utils/logger";
import { decodedTokenSchema } from "./validation";

export async function hasValidSignature(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.sendStatus(403);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(400);
  }

  try {
    const decodedToken = await verifySignature(token);

    const validatedDecodedToken = decodedTokenSchema.safeParse(decodedToken);

    if (!validatedDecodedToken.success) {
      return res.json({
        message: "Something went wrong while decoding the token",
      });
    }

    const { sub } = validatedDecodedToken.data;

    req.userId = sub;
    next();
  } catch (e) {
    logger.error((e as Error).message);
    return res.sendStatus(401);
  }
}
