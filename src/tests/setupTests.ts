import * as dotenv from "dotenv";
import request from "supertest";
import { app } from "../server";

jest.setTimeout(20000);

global.login = async () => {
  const response = await request(app)
    .post("/login")
    .send({ username: "testuser", password: "1234" });
  return response.body.token;
};
