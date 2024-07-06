import { app } from "../app";
import request from "supertest";

describe("Organisation Management Endpoints", () => {
  let accessToken: string;
  let orgId: string;

  beforeAll(async () => {
    const loginCredentials = {
      email: "ayomikuntemitope@example.com",
      password: "password",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials);

    accessToken = response.body.data.accessToken;
  });

  it("should create a new organisation", async () => {
    const newOrganisation = {
      name: "New Organisation",
      description: "This is a new organisation",
    };

    const response = await request(app)
      .post("/api/organisations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newOrganisation)
      .expect(201);

    expect(response.body.status).toBe("success");
    expect(response.body.data.organisation).toBeDefined();
    expect(response.body.data.organisation.name).toBe(newOrganisation.name);
    expect(response.body.data.organisation.description).toBe(
      newOrganisation.description
    );

    orgId = response.body.data.organisation.orgId;
  });

  it("should retrieve an organisation by ID", async () => {
    const response = await request(app)
      .get(`/api/organisations/${orgId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.organisation).toBeDefined();
    expect(response.body.data.organisation.orgId).toBe(orgId);
  });
});
