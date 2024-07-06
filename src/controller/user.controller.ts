import { Request, Response } from "express";
import { User } from "../models/user.model";

export class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "User not found",
          statusCode: 404,
        });
      }

      const userData = user.toJSON();
      delete userData.password;

      return res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: userData,
      });
    } catch (error) {
      return res.status(400).json({
        status: "Bad request",
        message: "Client error",
        statusCode: 400,
      });
    }
  }
}
