export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  createdAt?: Date;
}

export interface IOrganisation {
  orgId: string;
  name: string;
  description: string;
  createdAt?: Date;
}

export interface IUserOrganisation {
  userId: string;
  orgId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}
