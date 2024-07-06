import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { OrganisationController } from "../controller/organisation.controller";
import { organisationSchema } from "../schema";
import { validateData } from "../middleware/validation";

const organisationRoutes = Router();

organisationRoutes.post(
  "/organisations",
  validateData(organisationSchema),
  authMiddleware,
  OrganisationController.createOrganisation
);
organisationRoutes.get(
  "/organisations",
  authMiddleware,
  OrganisationController.getOrganisations
);
organisationRoutes.get(
  "/organisations/:orgId",
  authMiddleware,
  OrganisationController.getOrganisationById
);
organisationRoutes.post(
  "/organisations/:orgId/users",
  authMiddleware,
  OrganisationController.addUserToOrganisation
);

export { organisationRoutes };
