import { Router } from "express";
import { hasValidSignature } from "../middleware/jwtMiddleware";
import { predictController } from "../controllers/predictController";
import upload from "../lib/multer";
const predictRouter = Router();

predictRouter.post(
  "/midi",
  hasValidSignature,
  upload.single("file"),
  predictController,
);

export default predictRouter;
