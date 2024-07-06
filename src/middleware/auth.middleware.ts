import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../types";
import { User } from "../models/user.model";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "No token provided",
      statusCode: 401,
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded: IUser) => {
    if (err) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Failed to authenticate token",
        statusCode: 401,
      });
    }
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({
        status: "Unauthorized",
        message: "User not found",
        statusCode: 404,
      });
    }

    req.user = user;
    next();
  });
};
