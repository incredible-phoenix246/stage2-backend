import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { validateData } from "../middleware/validation";
import { userSchema, loginSchema } from "../schema";

const authRoutes = Router();

authRoutes.post("/register", validateData(userSchema), AuthController.register);
authRoutes.post("/login", validateData(loginSchema), AuthController.login);

export { authRoutes };
