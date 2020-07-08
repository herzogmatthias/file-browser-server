import { Express } from "express";
import {
  currentPath,
  downloadFile,
  renameFile,
  moveFile,
  deleteFiles,
} from "./file-system.controller";
import { checkToken } from "../../middleware/jwt.middleware";
import { checkPath } from "../../middleware/paths.middleware";

const fileSystemRoutes = (app: Express) => {
  app.route("/file-system/move").post(checkToken, checkPath, moveFile);
  app.route("/file-system/rename").post(checkToken, checkPath, renameFile);
  app.route("/file-system/download").post(checkToken, checkPath, downloadFile);
  app
    .route("/file-system/current-path")
    .post(checkToken, checkPath, currentPath);
  app.route("/file-system/delete").post(checkToken, checkPath, deleteFiles);
};

export default fileSystemRoutes;
