import { Express } from "express";
import {
  currentPath,
  downloadFile,
  renameFile,
  moveFile,
  deleteFiles,
} from "./file-system.controller";
import { checkToken } from "../../middleware/jwt.middleware";

const fileSystemRoutes = (app: Express) => {
  app.route("/file-system/move").post(checkToken, moveFile);
  app.route("/file-system/rename").post(checkToken, renameFile);
  app.route("/file-system/download").post(checkToken, downloadFile);
  app.route("/file-system/current-path").post(checkToken, currentPath);
  app.route("/file-system/delete").post(checkToken, deleteFiles);
};

export default fileSystemRoutes;
