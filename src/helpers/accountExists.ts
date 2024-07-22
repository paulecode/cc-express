import prisma from "../lib/db";

export async function checkAccountExistsById(id: number) {
  const user = await prisma.user.findFirst({ where: { id } });

  return !!user;
}

export async function checkAccountExistsByUsername(username: string) {
  const user = await prisma.user.findFirst({ where: { username } });

  return !!user;
}
