import { Router } from "express";
import upload from "../lib/multer";
import {
  deleteSingleFile,
  getAllFiles,
  uploadRawFileToS3,
} from "../controllers/fileController";
import { hasValidSignature } from "../middleware/jwtMiddleware";
const fileRouter = Router();

fileRouter.post(
  "/uploadFile",
  hasValidSignature,
  upload.single("file"),
  uploadRawFileToS3,
);

fileRouter.get("/getFile", hasValidSignature, getAllFiles);
fileRouter.delete("/deleteSingle", hasValidSignature, deleteSingleFile);

export default fileRouter;
