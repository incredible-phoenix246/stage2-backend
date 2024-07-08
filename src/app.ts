import cors from "cors";
import https from "https";
import cron from "node-cron";
import dotenv from "dotenv";
import express from "express";
import { sequelize } from "./models";
import { authRoutes } from "./routes/auth.routes";
import { organisationRoutes } from "./routes/organisation.routes";
import { userRoutes } from "./routes/user.routes";

dotenv.config();

const app = express();

app.options("*", cors());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err: unknown) => {
    console.error("Error creating database and tables:", err);
  });

app.use("/auth", authRoutes);
app.use("/api", organisationRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
