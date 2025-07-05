import app from "../app.js";
import request from "supertest";


let adminToken;

beforeAll(async () => {
  // Log in as admin
  const res = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "adminpass"
  });

  adminToken = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
});

describe("Admin Routes", () => {
  it("should get all users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Cookie", [`token=${adminToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.users).toBeInstanceOf(Array);
  });

  it("should get all mentorship requests", async () => {
    const res = await request(app)
      .get("/api/admin/requests")
      .set("Cookie", [`token=${adminToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.requests).toBeInstanceOf(Array);
  });
});