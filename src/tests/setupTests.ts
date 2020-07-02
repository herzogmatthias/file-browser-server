import * as dotenv from "dotenv";
import request from "supertest";
import { app } from "../server";

jest.setTimeout(5000);

global.login = async () => {
  const response = await request(app)
    .post("/login")
    .send({ username: "testuser", password: "1234" });
  console.log(response.body.token);
  return response.body.token;
};
