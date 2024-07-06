import { Sequelize } from "sequelize-typescript";
import { User } from "./user.model";
import { Organisation } from "./organisation.model";
import { UserOrganisation } from "./userOrganisation.model";
import * as pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  dialectModule: pg,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.addModels([User, Organisation, UserOrganisation]);
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing the database:", error);
  });
export { sequelize };
