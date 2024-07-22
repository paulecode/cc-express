import { checkAccountExistsByUsername } from "../helpers/accountExists";
import prisma from "../lib/db";
import { logger } from "../utils/logger";

export async function createAccount(username: string, password: string) {
  const accountExists = await checkAccountExistsByUsername(username);
  if (accountExists) {
    throw new Error("usernameTaken");
  }

  try {
    const accountCreated = await prisma.user.create({
      data: { username, password },
    });
    return accountCreated.id;
  } catch (err) {
    logger.error((err as Error).name);
    throw new Error((err as Error).name);
  }
}
