import app from "../app";
import { User } from "../models/user.model";
import request from "supertest";

let accessToken: string;

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    // Create a user for testing
    await User.create({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "password",
      phone: "070123456789",
    });
  });

  it("should register a new user", async () => {
    const newUser = {
      firstName: "New",
      lastName: "User",
      email: "newuser@example.com",
      password: "newpassword",
      phone: "9876543210",
    };

    const response = await request(app)
      .post("/auth/register")
      .send(newUser)
      .expect(201);

    expect(response.body.status).toBe("success");
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user.email).toBe(newUser.email);
  });

  it("should not register a user with duplicate email", async () => {
    const duplicateUser = {
      firstName: "Duplicate",
      lastName: "User",
      email: "newuser@example.com",
      password: "password123",
      phone: "5555555555",
    };

    const response = await request(app)
      .post("/auth/register")
      .send(duplicateUser)
      .expect(400);

    expect(response.body.status).toBe("Bad request");
    expect(response.body.message).toBe("User already exists");
  });

  it("should login an existing user", async () => {
    const loginCredentials = {
      email: "testuser@example.com",
      password: "password",
    };

    const response = await request(app)
      .post("/auth/login")
      .send(loginCredentials)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user.email).toBe(loginCredentials.email);

    accessToken = response.body.data.accessToken;
  });

  it("should not login with incorrect password", async () => {
    const incorrectPassword = {
      email: "testuser@example.com",
      password: "wrongpassword",
    };

    const response = await request(app)
      .post("/auth/login")
      .send(incorrectPassword)
      .expect(401);

    expect(response.body.status).toBe("Bad request");
    expect(response.body.message).toBe(
      "Authentication failed: User does not exist"
    );
  });
});
