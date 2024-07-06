import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { UserController } from "../controller/user.controller";

const userRoutes = Router();

userRoutes.get("/users/:id", authMiddleware, UserController.getUser);

export { userRoutes };
