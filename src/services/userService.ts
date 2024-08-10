import prisma from "../lib/db";

export async function getUserByUsername(username: string) {
  try {
    const user = await prisma.user.findFirstOrThrow({ where: { username } });
    return user;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function deleteUser(id: number) {
  try {
    return await prisma.user.delete({ where: { id } });
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
