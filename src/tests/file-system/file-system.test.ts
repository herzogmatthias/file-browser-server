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
      test: {
        "test.html": "<h1>Test</h1>",
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
describe("File-system Controller", () => {
  describe("POST /file-system/rename route", () => {
    describe("valid inputs", () => {
      test("when posting with two valid paths, file should be renamed", async (done) => {
        const response = await appRequest
          .post("/file-system/rename")
          .set("Authorization", `Bearer ${token}`)
          .send({
            oldPath: "root/coding/hello.js",
            newPath: "root/coding/hello2.js",
          });
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(existsSync("root/coding/hello2.js")).toBeTruthy();
        done();
      });
    });

    describe("invalid inputs", () => {
      test("when path is missing throw error", async (done) => {
        const response = await appRequest
          .post("/file-system/rename")
          .set("Authorization", `Bearer ${token}`)
          .send({
            oldPath: "root/coding/hello.js",
          });
        expect(response.status).not.toBe(200);

        done();
      });
      test("when path is wrong throw error", async (done) => {
        const response = await appRequest
          .post("/file-system/rename")
          .set("Authorization", `Bearer ${token}`)
          .send({
            oldPath: "root/coding/hello.js",
            newPath: "root/xdxdxd/hello2.js",
          });
        expect(response.status).not.toBe(200);

        done();
      });
    });
  });

  describe("POST /file-system/current-path route", () => {
    describe("valid inputs", () => {
      test("when calling with correct body, returning the current directory with details", async (done) => {
        const response = await appRequest
          .post("/file-system/current-path")
          .set("Authorization", `Bearer ${token}`)
          .send({
            paths: ["root/schule", "root/coding"],
          });
        expect(response.status).toBe(200);
        expect(response.body.dir.type).toBe("folder");
        done();
      });
    });
    describe("invalid inputs", () => {
      test("when calling with incorrect body, throwing error", async (done) => {
        const response = await appRequest
          .post("/file-system/current-path")
          .set("Authorization", `Bearer ${token}`)
          .send({
            paths: "root/schule",
          });
        expect(response.status).not.toBe(200);
        done();
      });
      test("when calling with false path, throwing error", async (done) => {
        const response = await appRequest
          .post("/file-system/current-path")
          .set("Authorization", `Bearer ${token}`)
          .send({
            paths: ["root/asdf"],
          });
        expect(response.status).not.toBe(200);
        done();
      });
    });
  });

  describe("POST /file-system/delete route", () => {
    describe("valid inputs", () => {
      test("when calling with correct body, deleting the files or directories", async (done) => {
        const response = await appRequest
          .post("/file-system/delete")
          .set("Authorization", `Bearer ${token}`)
          .send({
            paths: ["root/schule/test.txt", "root/coding"],
          });
        expect(response.status).toBe(200);
        expect(existsSync("root/schule/test.txt")).toBeFalsy();
        expect(existsSync("root/coding/hello.js")).toBeFalsy();
        done();
      });
    });
    describe("invalid inputs", () => {
      test("when calling with incorrect body, throws error", async (done) => {
        const response = await appRequest
          .post("/file-system/delete")
          .set("Authorization", `Bearer ${token}`)
          .send({
            paths: ["root/asdf/test.txt", "root/coding"],
          });
        expect(response.status).not.toBe(200);
        done();
      });
    });
  });
  describe("POST /file-system/move route", () => {
    describe("valid inputs", () => {
      test("when calling with correct body, moving the files or directories", async (done) => {
        const response = await appRequest
          .post("/file-system/move")
          .set("Authorization", `Bearer ${token}`)
          .send({
            oldPaths: ["root/test", "root/coding/hello.js"],
            newPath: "root/schule",
          });
        expect(response.status).toBe(200);
        expect(existsSync("root/schule/hello.js")).toBeTruthy();
        expect(existsSync("root/schule/test")).toBeTruthy();
        done();
      });
    });
    describe("invalid inputs", () => {
      test("when calling with incorrect paths, throws error", async (done) => {
        const response = await appRequest
          .post("/file-system/move")
          .set("Authorization", `Bearer ${token}`)
          .send({
            oldPaths: ["root/xxxx", "root/coding/hello.js"],
            newPath: "root/schule",
          });
        expect(response.status).not.toBe(200);
        expect(existsSync("root/schule/hello.js")).toBeFalsy();
        done();
      });
    });
  });
  describe("POST /file-system/download route", () => {
    describe("valid inputs", () => {
      test("when calling with correct body, downloading file ", async (done) => {
        const response = await appRequest
          .post("/file-system/download")
          .set("Authorization", `Bearer ${token}`)
          .send({
            path: "root/schule/test.txt",
          });
        expect(response.status).toBe(200);
        done();
      });
      test("when calling with correct body, downloading dir", async (done) => {
        const response = await appRequest
          .post("/file-system/download")
          .set("Authorization", `Bearer ${token}`)
          .send({
            path: "root/schule",
          });
        expect(response.status).toBe(200);
        done();
      });
    });
    describe("invalid inputs", () => {
      test("when calling with incorrect paths, throws error", async (done) => {
        const response = await appRequest
          .post("/file-system/download")
          .set("Authorization", `Bearer ${token}`)
          .send({
            path: "root/asdfasf",
          });
        expect(response.status).not.toBe(200);
        done();
      });
    });
  });
});
