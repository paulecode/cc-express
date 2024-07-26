import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkAccountExistsByUsername } from "../helpers/accountExists";
import prisma from "../lib/db";
import { logger } from "../utils/logger";

export async function createAccount(username: string, password: string) {
  const accountExists = await checkAccountExistsByUsername(username);
  if (accountExists) {
    throw new Error("usernameTaken");
  }

  try {
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
  const secret = process.env.JWT_SECRET || "";

  const token = jwt.sign({ sub: payload }, secret, {
    expiresIn: "1h",
  });

  return token;
}

export async function verifySignature(token: string) {
  try {
    const secret = process.env.SECRET || "";
    const decodedToken = jwt.verify(token, secret);
  } catch (e) {}
}
