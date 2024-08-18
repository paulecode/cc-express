import { NextFunction, Request, Response } from "express";
import { predictService } from "../services/predictService";
import {
  checkIfFileExists,
  fileUploadService,
  generateFileKey,
  markUploadSuccess,
  saveFileInfoToDatabase,
} from "../services/fileService";
import { logger } from "../utils/logger";

export async function predictController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = req.file;

    if (!file) {
      throw new Error("File not uploaded");
    }

    const id = req.userId;

    if (!id) {
      throw new Error("Token missing ID");
    }

    const fileKey = generateFileKey(file.originalname, file.mimetype, id);

    // const isFileExists = await checkIfFileExists(fileKey);
    //
    // if (isFileExists) {
    //   throw new Error("File already exists");
    // }
    //
    // const uploadedFileInfo = await saveFileInfoToDatabase(
    //   fileKey,
    //   file.originalname,
    //   file.mimetype,
    //   id,
    // );
    //
    // const result = await fileUploadService(
    //   "classifying-classic-data",
    //   fileKey,
    //   file,
    // );
    //
    // logger.trace(result.$metadata.httpStatusCode);
    //
    // await markUploadSuccess(uploadedFileInfo.id);

    res
      .status(200)
      .json({ message: "File uploaded successfully", key: fileKey });

    const predictResult = await predictService(file);
    logger.info(predictResult);
  } catch (err) {
    next(err);
  }
}
