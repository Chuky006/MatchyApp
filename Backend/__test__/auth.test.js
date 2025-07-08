
import app from "../app.js";
import request from "supertest";

import mongoose from "mongoose";

const testUser = {
  name: "Jane Doe",
  email: "janedoe@example.com",
  password: "password123",
  role: "mentee"
};

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });

  it("should not register user with existing email", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });
});
