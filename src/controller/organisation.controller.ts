import { Request, Response } from "express";
import { Organisation } from "../models/organisation.model";
import { User } from "../models/user.model";
import { UserOrganisation } from "../models/userOrganisation.model";

export class OrganisationController {
  static async createOrganisation(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const userId = req.user.userId;

      const organisation = new Organisation({
        name,
        description,
      });

      await organisation.save();

      await UserOrganisation.create({
        userId,
        orgId: organisation.orgId,
      });

      return res.status(201).json({
        status: "success",
        message: "Organisation created successfully",
        data: {
          orgId: organisation.orgId,
          name: organisation.name,
          description: organisation.description,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Bad request",
        message: "Client error",
        statusCode: 400,
      });
    }
  }

  static async getOrganisations(req: Request, res: Response) {
    try {
      const userId = req.user.userId;

      const organisations = await Organisation.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
            through: {
              where: { userId },
            },
          },
        ],
      });

      return res.status(200).json({
        status: "success",
        message: "Organisations retrieved successfully",
        data: {
          organisations,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "Bad request",
        message: "Client error",
        statusCode: 400,
      });
    }
  }

  static async getOrganisationById(req: Request, res: Response) {
    try {
      const { orgId } = req.params;

      const organisation = await Organisation.findByPk(orgId, {
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
            // through: {
            //   attributes: [],
            // },
          },
        ],
      });

      if (!organisation) {
        return res.status(404).json({
          status: "Not Found",
          message: "Organisation not found",
          statusCode: 404,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Organisation retrieved successfully",
        data: {
          organisation,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }
  }

  static async addUserToOrganisation(req: Request, res: Response) {
    try {
      const { orgId } = req.params;
      const { userId } = req.body;

      const organisation = await Organisation.findByPk(orgId);
      const user = await User.findByPk(userId);

      if (!organisation || !user) {
        return res.status(404).json({
          status: "Not Found",
          message: "Organisation or User not found",
          statusCode: 404,
        });
      }

      await UserOrganisation.create({ orgId, userId });

      return res.status(201).json({
        status: "success",
        message: "User added to organisation successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Bad request",
        message: "Client error",
        statusCode: 400,
      });
    }
  }
}
