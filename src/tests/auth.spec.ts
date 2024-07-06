// import app from "../app";
// import { User } from "../models/user.model";
// import request from "supertest";

// let accessToken: string;

// describe("Authentication Endpoints", () => {
//   beforeAll(async () => {
//     // Create a user for testing
//     await User.create({
//       firstName: "Test",
//       lastName: "User",
//       email: "testuser@example.com",
//       password: "password",
//       phone: "070123456789",
//     });
//   });

//   it("should register a new user", async () => {
//     const newUser = {
//       firstName: "New",
//       lastName: "User",
//       email: "newuser@example.com",
//       password: "newpassword",
//       phone: "9876543210",
//     };

//     const response = await request(app)
//       .post("/auth/register")
//       .send(newUser)
//       .expect(201);

//     expect(response.body.status).toBe("success");
//     expect(response.body.data.accessToken).toBeDefined();
//     expect(response.body.data.user.email).toBe(newUser.email);
//   });

//   it("should not register a user with duplicate email", async () => {
//     const duplicateUser = {
//       firstName: "Duplicate",
//       lastName: "User",
//       email: "newuser@example.com",
//       password: "password123",
//       phone: "5555555555",
//     };

//     const response = await request(app)
//       .post("/auth/register")
//       .send(duplicateUser)
//       .expect(400);

//     expect(response.body.status).toBe("Bad request");
//     expect(response.body.message).toBe("User already exists");
//   });

//   it("should login an existing user", async () => {
//     const loginCredentials = {
//       email: "testuser@example.com",
//       password: "password",
//     };

//     const response = await request(app)
//       .post("/auth/login")
//       .send(loginCredentials)
//       .expect(200);

//     expect(response.body.status).toBe("success");
//     expect(response.body.data.accessToken).toBeDefined();
//     expect(response.body.data.user.email).toBe(loginCredentials.email);

//     accessToken = response.body.data.accessToken;
//   });

//   it("should not login with incorrect password", async () => {
//     const incorrectPassword = {
//       email: "testuser@example.com",
//       password: "wrongpassword",
//     };

//     const response = await request(app)
//       .post("/auth/login")
//       .send(incorrectPassword)
//       .expect(401);

//     expect(response.body.status).toBe("Bad request");
//     expect(response.body.message).toBe(
//       "Authentication failed: User does not exist"
//     );
//   });
// });

import request from "supertest";
import app from "../app";

let accessToken: string;

async function registerUser() {
  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    phone: "1234567890",
  };

  await request(app)
    .post("/auth/register")
    .send(userData)
    .expect(201)
    .then((response) => {
      accessToken = response.body.data.accessToken;
    });
}

describe("Authentication Endpoints", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const newUser = {
        firstName: "New",
        lastName: "User",
        email: "newuser@example.com",
        password: "newpassword",
        phone: "9876543210",
      };

      const expectedOrgName = `${newUser.firstName}'s Organisation`;

      const response = await request(app)
        .post("/auth/register")
        .send(newUser)
        .expect(201);

      const { user, accessToken: receivedAccessToken } = response.body.data;
      expect(response.body.status).toBe("success");
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(user.userId).toBeTruthy();
      expect(user.firstName).toBe(newUser.firstName);
      expect(user.lastName).toBe(newUser.lastName);
      expect(user.email).toBe(newUser.email);
      expect(user.phone).toBe(newUser.phone);
      expect(receivedAccessToken).toBeTruthy();
      expect(user.organisation.name).toBe(expectedOrgName);
    });

    it("should fail if required fields are missing", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        phone: "1234567890",
      };

      await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(422)
        .expect((res) => {
          expect(res.body.status).toBe("Bad request");
          expect(res.body.message).toContain("Validation error");
        });
    });

    it("should fail if there is a duplicate email", async () => {
      await registerUser();

      const duplicateUserData = {
        firstName: "Jane",
        lastName: "Smith",
        email: "john.doe@example.com",
        password: "password456",
        phone: "9876543210",
      };

      await request(app)
        .post("/auth/register")
        .send(duplicateUserData)
        .expect(422)
        .expect((res) => {
          expect(res.body.status).toBe("Bad request");
          expect(res.body.message).toContain("User already exists");
        });
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      await registerUser();
    });

    it("should log the user in successfully", async () => {
      const loginCredentials = {
        email: "john.doe@example.com",
        password: "password123",
      };

      await request(app)
        .post("/auth/login")
        .send(loginCredentials)
        .expect(200)
        .expect((res) => {
          const { user, accessToken: receivedAccessToken } = res.body.data;
          expect(user.userId).toBeTruthy();
          expect(user.firstName).toBe("John");
          expect(user.lastName).toBe("Doe");
          expect(user.email).toBe("john.doe@example.com");
          expect(receivedAccessToken).toBeTruthy();
        });
    });

    it("should fail if login credentials are incorrect", async () => {
      const incorrectCredentials = {
        email: "john.doe@example.com",
        password: "incorrectpassword",
      };

      await request(app)
        .post("/auth/login")
        .send(incorrectCredentials)
        .expect(401)
        .expect((res) => {
          expect(res.body.status).toBe("Bad request");
          expect(res.body.message).toBe(
            "Authentication failed: User does not exist"
          );
        });
    });
  });
});

describe("Organisation Management Endpoints", () => {
  beforeEach(async () => {
    await registerUser();
  });

  describe("POST /api/organisations", () => {
    it("should create a new organisation", async () => {
      const newOrgData = {
        name: "New Organisation",
        description: "Description of New Organisation",
      };

      await request(app)
        .post("/api/organisations")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(newOrgData)
        .expect(201)
        .expect((res) => {
          const organisation = res.body.data;

          expect(organisation.orgId).toBeTruthy();
          expect(organisation.name).toBe(newOrgData.name);
          expect(organisation.description).toBe(newOrgData.description);
        });
    });
  });

  describe("GET /api/organisations/:orgId", () => {
    it("should retrieve an organisation by ID", async () => {
      let orgId: string;

      const newOrgData = {
        name: "New Organisation",
        description: "Description of New Organisation",
      };

      await request(app)
        .post("/api/organisations")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(newOrgData)
        .expect(201)
        .then((res) => {
          orgId = res.body.data.orgId;
        });

      await request(app)
        .get(`/api/organisations/${orgId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          const organisation = res.body.data.organisation;
          expect(organisation.orgId).toBe(orgId);
          expect(organisation.name).toBe(newOrgData.name);
          expect(organisation.description).toBe(newOrgData.description);
          expect(organisation.users.length).toBe(1);
          expect(organisation.users[0].userId).toBeTruthy();
        });
    });

    it("should fail if organisation ID does not exist", async () => {
      const nonExistentOrgId = "non-existent-org-id";

      await request(app)
        .get(`/api/organisations/${nonExistentOrgId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.status).toBe("Not Found");
          expect(res.body.message).toBe("Organisation not found");
        });
    });
  });
});
