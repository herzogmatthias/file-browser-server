import { Express } from "express";
import { renameFile, moveFile } from "./file.controller";

const fileRoutes = (app: Express) => {
  app.route("/file/rename").post(renameFile);
  app.route("/file/move").post(moveFile);
};

export default fileRoutes;
