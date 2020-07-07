import mock, { getMockRoot } from "mock-fs";
import request, { SuperTest, Test } from "supertest";
import { app } from "../../server";
import { lstat, readdirSync } from "fs";

let token: string = "";
let appRequest: SuperTest<Test>;
beforeAll(async () => {
  appRequest = request(app);
  token = await global.login();
  console.log(token);
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

describe("File Controller", () => {
  describe("POST /file/content route", () => {
    describe("valid inputs", () => {
      test("when calling with a correct route with unsupported file for unoconv, file data should be returned not base64 encoded", async (done) => {
        console.log("start file/content");
        const response = await appRequest
          .post("/file/content")
          .set("Authorization", `Bearer ${token}`)
          .send({ path: "root/coding/hello.js" });
        expect(response.body.base64).toBeFalsy();
        done();
      });
      //returns error because mock fs and unoconv not working obviously
      test("when calling with a correct route with support file for unoconv, base64 encoded string should be returned (error because of unoconv)", async (done) => {
        const response = await appRequest
          .post("/file/content")
          .set("Authorization", `Bearer ${token}`)
          .send({ path: "root/schule/test.txt" });
        expect(response.body.hasError).toBeTruthy();
        done();
      });
    });
    describe("invalid inputs", () => {
      test("when calling with a wrong path, error should be returned", async (done) => {
        const response = await appRequest
          .post("/file/content")
          .set("Authorization", `Bearer ${token}`)
          .send({ path: "root/schule/" });
        expect(response.status).not.toEqual(200);
        done();
      });
    });
  });
  describe("POST /file/generate-preview route", () => {
    describe("valid inputs", () => {
      test("when calling route with valid path, thumbnail will be created (error because of unoconv)", async (done) => {
        const response = await appRequest
          .post("/file/generate-preview")
          .set("Authorization", `Bearer ${token}`)
          .send({ path: "root/schule/test.png" });
        expect(response.body.hasError).toBeTruthy();
        done();
      });
    });

    describe("invalid inputs", () => {
      test("When calling route with invalid path, error will be returned", async (done) => {
        const response = await appRequest
          .post("/file/generate-preview")
          .set("Authorization", `Bearer ${token}`)
          .send({ path: "root/schule/" });
        expect(response.status).not.toEqual(200);
        done();
      });
    });
  });
});
