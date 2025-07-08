import app from "../app.js";
import request from "supertest";


let menteeToken;
let mentorId;

beforeAll(async () => {

  const res = await request(app).post("/api/auth/login").send({
    email: "janedoe@example.com",
    password: "password123"
  });

  menteeToken = res.headers["set-cookie"][0].split(";")[0].split("=")[1];

  const mentors = await request(app)
    .get("/api/admin/users")
    .set("Cookie", [`token=${menteeToken}`]);

  const mentor = mentors.body.users.find((u) => u.role === "mentor");
  mentorId = mentor?._id;
});

describe("Mentorship Sessions", () => {
  it("should book a session", async () => {
    const res = await request(app)
      .post("/api/sessions")
      .set("Cookie", [`token=${menteeToken}`])
      .send({
        mentorId,
        date: "2025-07-08",
        time: "14:00"
      });

    expect([201, 400]).toContain(res.statusCode);
  });

  it("should get upcoming sessions", async () => {
    const res = await request(app)
      .get("/api/sessions")
      .set("Cookie", [`token=${menteeToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.sessions).toBeInstanceOf(Array);
  });
});