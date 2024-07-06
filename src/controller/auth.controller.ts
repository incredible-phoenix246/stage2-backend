import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import { Organisation } from "../models/organisation.model";
import { UserOrganisation } from "../models/userOrganisation.model";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, phone } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(422).json({
          status: "Bad request",
          message: "User already exists",
          statusCode: 422,
        });
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
      });

      user.password = await bcrypt.hash(password, 10);
      await user.save();

      const organisation = new Organisation({
        name: `${firstName}'s Organisation`,
        description: "",
      });

      await organisation.save();

      await UserOrganisation.create({
        userId: user.userId,
        orgId: organisation.orgId,
      });

      const accessToken = jwt.sign(
        { userId: user.userId, email: user.email },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRATION,
        }
      );

      return res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            organisation: organisation,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Bad request",
        message: "Registration unsuccessful",
        statusCode: 400,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          status: "Bad request",
          message: "Authentication failed: User does not exist",
          statusCode: 401,
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          status: "Bad request",
          message: "Authentication failed: User does not exist",
          statusCode: 401,
        });
      }

      const accessToken = jwt.sign(
        { userId: user.userId, email: user.email },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRATION,
        }
      );

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          },
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }
  }
}
