import { Request, Response, NextFunction } from "express";
import { loginSchema } from "./validation";

async function register(req: Request, res: Response, next: NextFunction) {
  const zodResult = loginSchema.safeParse(req.body);

  if (zodResult.success) {
    const { username, password } = zodResult.data;
    res.json({ username, password });
    console.log(username);
  } else {
    next(zodResult.error);
  }
}

export { register };
