import { NextFunction, Request, Response } from "express";
import { fileUploadService } from "../services/fileService";

export async function uploadFileToS3(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const file = req.file;

  if (!file) {
    return res.sendStatus(400);
  }

  try {
    const result = await fileUploadService("classifying-classic-data", file);
    return res.json(result);
  } catch (err) {
    return res.sendStatus(500);
  }
}
