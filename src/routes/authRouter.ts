import { Router } from "express";
import { login, register } from "../controllers/authController";
import { hasValidSignature } from "../middleware/jwtMiddleware";
import { deleteAccount } from "../controllers/authController";
const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.delete("/deleteAccount", hasValidSignature, deleteAccount);

export default authRouter;
