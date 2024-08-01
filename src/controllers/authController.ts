import { Request, Response, NextFunction } from "express";
import { loginSchema } from "./validation";
import {
  attemptLogin,
  createAccount,
  doesHashMatchPassword,
} from "../services/authService";
import { checkAccountExistsByUsername } from "../helpers/accountExists";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const zodResult = loginSchema.safeParse(req.body);

  if (zodResult.success) {
    const { username, password } = zodResult.data;

    try {
      const newId = await createAccount(username, password);
      res.json({ username, newId });
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  } else {
    next(zodResult.error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const zodResult = loginSchema.safeParse(req.body);

  if (zodResult.success) {
    const { username, password } = zodResult.data;

    const loginAttempt = await attemptLogin(username, password);

    if (!loginAttempt) {
      return res.sendStatus(401);
    }

    res.json({ result: loginAttempt });
  } else {
    next(zodResult.error);
  }
}
