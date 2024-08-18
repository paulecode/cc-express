import { NextFunction, Request, Response } from "express";
import {
  checkIfFileExists,
  deleteSingleObject,
  deleteSingleObjectInfo,
  fileUploadService,
  generateFileKey,
  getAllUserFileKeys,
  markUploadSuccess,
  saveFileInfoToDatabase,
} from "../services/fileService";
import { logger } from "../utils/logger";
import {
  fileUploadRequestSchema,
  singleFileDeletionRequestSchema,
} from "./validation";

export async function handleFileUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const file = req.file;
  const zodResult = fileUploadRequestSchema.safeParse(req.body);

  const id = req.userId!;

  const bucketName = "classifying-classic-data";

  if (!file) {
    return res.sendStatus(400);
  }

  if (!zodResult.success) {
    return res.status(400).json({ message: "Something went wrong" });
  }

  try {
    const key = generateFileKey(file.originalname, file.mimetype, id);

    const fileExists = await checkIfFileExists(key);

    if (fileExists) {
      return res
        .status(403)
        .json({ message: "A file with this name already exists" });
    }

    const uploadedFileInfo = await saveFileInfoToDatabase(
      key,
      file.originalname,
      file.mimetype,
      id,
    );

    const result = await fileUploadService(bucketName, key, file);

    await markUploadSuccess(uploadedFileInfo.id);

    return res.json(result);
  } catch (err) {
    logger.error(err);
    next();
  }
}

export async function getAllUserFiles(req: Request, res: Response) {
  const id = req.userId!;

  // todo try catch
  const filekeys = await getAllUserFileKeys(id);

  return res.json(filekeys);
}

export async function deleteSingleFile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const zodResult = singleFileDeletionRequestSchema.safeParse(req.body);

  if (!zodResult.success) {
    return res.status(400).json({ message: "Something went wrong" });
  }

  // TODO somehow verify ownership

  const { key } = zodResult.data;

  try {
    if (!(await checkIfFileExists(key))) {
      return res.status(404).json({ message: "File doesn't exist" });
    }
    const result = await deleteSingleObject(key);

    if (result.$metadata.httpStatusCode != 204) {
      throw new Error("Something went wrong while deleting from S3");
    }

    const deletedInfo = await deleteSingleObjectInfo(key);

    return res.json({
      message: `Successfully deleted ${deletedInfo.filename}`,
    });
  } catch (err) {
    logger.error(err);
    next();
  }
}
