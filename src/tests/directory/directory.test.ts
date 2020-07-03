import request, { SuperTest, Test } from "supertest";
import { app } from "../../server";
import mock from "mock-fs";
import { existsSync } from "fs-extra";

let token: string = "";
let appRequest: SuperTest<Test>;
beforeAll(async () => {
  appRequest = request(app);
  token = await global.login();
});
beforeEach(() => {
  mock({
    root: {
      schule: {
        "test.txt": "Hello world",
        "test.png": Buffer.from([8, 6, 7, 5, 3, 0, 9]),
      },
      coding: {
        "hello.html": "<h1>Hello world</h1>",
        "hello.js": 'export const hello = () => {console.log("hello world")}',
      },
      restricted: {
        "hello_restriced.html": "<h1>Hello world</h1>",
      },
    },
  });
});
afterAll(() => {
  mock.restore();
});

describe("Directory Controller", () => {
  describe("POST /directory/new/:name route", () => {
    describe("valid inputs", () => {
      test("when calling route with route param and right path, a new directory will be created", async (done) => {
        const response = await appRequest
          .post("/directory/new/newClass")
          .set("Authorization", `Bearer: ${token}`)
          .send({ path: "root/schule" });
        expect(existsSync(response.body.dir.path)).toBeTruthy();
        expect(response.status).toBe(200);
        done();
      });
    });
    describe("invalid inputs", async () => {
      test("when calling route without route param, a error should be returned", async (done) => {
        const response = await appRequest
          .post("/directory/new/")
          .set("Authorization", `Bearer: ${token}`)
          .send({ path: "root/schule" });
        expect(response.status).not.toBe(200);
        done();
      });
      test("when calling route without wrong path, a error should be returned", async (done) => {
        const response = await appRequest
          .post("/directory/new/newClass")
          .set("Authorization", `Bearer: ${token}`)
          .send({ path: "root/schule/test.txt" });
        expect(response.status).not.toBe(200);
        done();
      });
    });
  });
});
