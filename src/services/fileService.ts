import prisma from "../lib/db";
import { s3 } from "../lib/s3";
import {
  Delete,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ObjectIdentifier,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { logger } from "../utils/logger";
import { Prisma } from "@prisma/client";

export async function fileUploadService(
  bucketName: string,
  Key: string,
  file: Express.Multer.File,
) {
  const uploadParameters = {
    Bucket: bucketName,
    Body: file.buffer,
    Key,
    ContentType: file.mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParameters));
}

export async function markUploadSuccess(id: number) {
  try {
    await prisma.uploadedFile.update({
      data: { success: true },
      where: { id },
    });
  } catch (err) {
    throw new Error("Something went wrong updating prisma success");
  }
}

export async function saveFileInfoToDatabase(
  key: string,
  filename: string,
  mimetype: string,
  userId: number,
) {
  try {
    return await prisma.uploadedFile.create({
      data: {
        key,
        filename,
        mimetype,
        success: false,
        userId: userId as number,
      },
    });
  } catch (err) {
    throw new Error(
      "Something went wrong while saving file in database, aborting",
    );
  }
}

export async function checkIfFileExists(key: string) {
  try {
    const file = await prisma.uploadedFile.findFirst({
      where: { key, success: true },
    });

    if (file) return true;

    return false;
  } catch (err) {
    throw new Error("Something went wrong trying to find an entry");
  }
}

export function generateFileKey(
  filename: string,
  filetype: string,
  userId: number,
) {
  return `${filetype}/${userId}/${filename}`;
}

export async function getAllUserFileKeys(userId: number) {
  try {
    const fileKeys = await prisma.uploadedFile.findMany({
      where: { userId },
      select: { key: true },
    });

    return fileKeys;
  } catch (err) {
    logger.error(err);
    throw new Error("Error while getting file keys");
  }
}

type fileKeyWithPayload = Prisma.UploadedFileGetPayload<{
  select: { key: true };
}>;

export function createDeleteObjectsArray(
  fileKeys: fileKeyWithPayload[],
): ObjectIdentifier[][] {
  const deletionArray: ObjectIdentifier[][] = [];
  for (let i = 0; i < fileKeys.length; i += 3) {
    const request = fileKeys.slice(i, i + 3).map((key) => ({ Key: key.key }));
    deletionArray.push(request);
  }
  return deletionArray;
}

export async function deleteObjects(objectArray: ObjectIdentifier[]) {
  return s3.send(
    new DeleteObjectsCommand({
      Bucket: "classifying-classic-data",
      Delete: { Objects: objectArray },
    }),
  );
}

export async function deleteSingleObject(fileKey: string) {
  return s3.send(
    new DeleteObjectCommand({
      Bucket: "classifying-classic-data",
      Key: fileKey,
    }),
  );
}

export async function deleteSingleObjectInfo(fileKey: string) {
  const result = await prisma.uploadedFile.delete({ where: { key: fileKey } });

  return result;
}

export async function deleteMultipleObjects(
  deleteObjectsArray: ObjectIdentifier[][],
) {
  for (const deleteObject in deleteObjectsArray) {
    console.log(deleteObjectsArray[deleteObject]);

    await deleteObjects(deleteObjectsArray[deleteObject]);
  }
}
