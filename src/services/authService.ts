import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkAccountExistsByUsername } from "../helpers/accountExists";
import prisma from "../lib/db";
import { logger } from "../utils/logger";
import { getUserByUsername } from "./userService";

export async function createAccount(username: string, password: string) {
  try {
    const accountExists = await checkAccountExistsByUsername(username);
    if (accountExists) {
      throw new Error("usernameTaken");
    }
    password = await hashPassword(password);
    const accountCreated = await prisma.user.create({
      data: { username, password },
    });
    return accountCreated.id;
  } catch (err) {
    logger.error((err as Error).name);
    throw new Error((err as Error).name);
  }
}

export async function hashPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (err) {
    logger.error(err);
    throw new Error((err as Error).message);
  }
}

export async function doesHashMatchPassword(hash: string, password: string) {
  return await bcrypt.compare(password, hash);
}

export function generateToken(payload: string) {
  const secret = process.env.JWT_SECRET || "testSecret";

  const token = jwt.sign({ sub: payload }, secret, {
    expiresIn: "1w",
  });

  return token;
}

export async function verifySignature(token: string) {
  try {
    const secret = process.env.JWT_SECRET || "testSecret";
    const decodedToken = jwt.verify(token, secret);
    return decodedToken;
  } catch (e) {
    throw new Error("loginError");
  }
}

export async function attemptLogin(username: string, password: string) {
  try {
    if (!(await checkAccountExistsByUsername(username))) {
      throw new Error("Account doesn't exist");
    }

    const user = await getUserByUsername(username);

    if (await doesHashMatchPassword(user.password, password)) {
      const token = generateToken(user.id.toString());
      return token;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    logger.error((err as Error).message);
    return false;
  }
}
