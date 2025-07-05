//get user profile after login

import request from "supertest";
import app from "../app.js";

let cookie; // to store the extracted cookie for future requests

beforeAll(async () => {
  await request(app).post("/api/auth/register").send({
    name: "Jane Doe",
    email: "janedoe@example.com",
    password: "password123",
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "janedoe@example.com",
    password: "password123",
  });

  expect(res.statusCode).toBe(200);
  expect(res.headers["set-cookie"]).toBeDefined();

  cookie = res.headers["set-cookie"][0].split(";")[0]; // e.g., "token=abc123"
});

describe("Profile", () => {
  it("should get the logged-in user’s profile", async () => {
    const res = await request(app)
      .get("/api/profile/me")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "janedoe@example.com");
  });
});