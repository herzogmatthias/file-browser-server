import request, { SuperTest, Test } from "supertest";
import { app } from "../../server";

describe("Login Controller", () => {
  let appRequest: SuperTest<Test>;
  beforeEach(() => {
    appRequest = request(app);
  });
  describe("valid login", () => {
    test("when login with correct credentials user should get token", async (done) => {
      const response = await appRequest
        .post("/login")
        .send({ username: "testuser", password: "1234" });

      expect(response.body).toHaveProperty("token");
      done();
    });
  });

  describe("invalid login", () => {
    test("when login with missing credentials, error should be thrown", async (done) => {
      const response = await appRequest
        .post("/login")
        .send({ username: "testuser" });
      expect(response.status).toEqual(500);
      expect(response.body.hasError).toEqual(true);
      done();
    });
    test("when login with wrong password, error should be thrown", async (done) => {
      const response = await appRequest
        .post("/login")
        .send({ username: "testuser", password: "1235" });
      expect(response.status).toEqual(500);
      expect(response.body.hasError).toEqual(true);
      done();
    });
    test("when login with wrong username, error should be thrown", async (done) => {
      const response = await appRequest
        .post("/login")
        .send({ username: "testuserxx", password: "1235" });
      expect(response.status).toEqual(500);
      expect(response.body.hasError).toEqual(true);
      done();
    });
  });
});
