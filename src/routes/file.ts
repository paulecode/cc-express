import { Router } from "express";
import upload from "../lib/multer";
import { uploadFileToS3 } from "../controllers/fileController";
import { hasValidSignature } from "../middleware/jwtMiddleware";
const fileRouter = Router();

fileRouter.post(
  "/uploadFile",
  hasValidSignature,
  upload.single("file"),
  uploadFileToS3,
);

export default fileRouter;
