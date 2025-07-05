import app from "../app.js";
import request from "supertest";


let menteeToken;
let mentorId;

beforeAll(async () => {
  // Log in as mentee
  const res = await request(app).post("/api/auth/login").send({
    email: "janedoe@example.com",
    password: "password123"
  });

  menteeToken = res.headers["set-cookie"][0].split(";")[0].split("=")[1];

  // Get a sample mentor (assumes one exists in DB)
  const mentors = await request(app)
    .get("/api/admin/users")
    .set("Cookie", [`token=${menteeToken}`]);

  const mentor = mentors.body.users.find((u) => u.role === "mentor");
  mentorId = mentor?._id;
});

describe("Mentorship Requests", () => {
  it("should send a mentorship request", async () => {
    const res = await request(app)
      .post("/api/requests")
      .set("Cookie", [`token=${menteeToken}`])
      .send({
        mentorId,
        message: "I’d like to learn from you"
      });

    expect([201, 400]).toContain(res.statusCode); // 400 if already exists
  });

  it("should return sent requests", async () => {
    const res = await request(app)
      .get("/api/requests/sent")
      .set("Cookie", [`token=${menteeToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.requests).toBeInstanceOf(Array);
  });
});