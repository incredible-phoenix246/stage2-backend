import request from "supertest";
import { app } from "../app";
import { sequelize } from "../models";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe("Auth Endpoints", () => {
  it("should register user successfully with default organisation", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.user.firstName).toBe("John");
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("should log the user in successfully", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    expect(res.status).toBe(422);
  });

  it("should fail if there’s duplicate email or userId", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "0987654321",
    });

    expect(res.status).toBe(422);
  });
});
