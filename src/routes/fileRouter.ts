import { Router } from "express";
import upload from "../lib/multer";
import {
  deleteSingleFile,
  getAllUserFiles,
  handleFileUpload,
} from "../controllers/fileController";
import { hasValidSignature } from "../middleware/jwtMiddleware";
const fileRouter = Router();

fileRouter.post(
  "/uploadFile",
  hasValidSignature,
  upload.single("file"),
  handleFileUpload,
);

fileRouter.get("/getFile", hasValidSignature, getAllUserFiles);
fileRouter.delete("/deleteSingle", hasValidSignature, deleteSingleFile);

export default fileRouter;
