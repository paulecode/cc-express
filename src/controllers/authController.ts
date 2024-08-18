import { Request, Response, NextFunction } from "express";
import { loginSchema } from "./validation";
import { attemptLogin, createAccount } from "../services/authService";
import { checkAccountExistsById } from "../helpers/accountExists";
import {
  createDeleteObjectsArray,
  deleteMultipleObjects,
  getAllUserFileKeys,
} from "../services/fileService";
import { deleteUser } from "../services/userService";

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

export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.userId!;

  if (!(await checkAccountExistsById(id))) {
    return res.json({ message: "Account doesn't exist anymore" });
  }

  try {
    const filesToDelete = await getAllUserFileKeys(id);

    const filesClustered = createDeleteObjectsArray(filesToDelete);

    await deleteMultipleObjects(filesClustered);

    const deletedUser = await deleteUser(id);

    return res.json({ message: deletedUser.username });
  } catch (err) {
    next();
  }
}
