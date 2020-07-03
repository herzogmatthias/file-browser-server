import { Express } from "express";
import {
  currentPath,
  downloadFile,
  renameFile,
  moveFile,
} from "./file-system.controller";

const fileSystemRoutes = (app: Express) => {
  app.route("/file-system/move").post(moveFile);
  app.route("/file-system/rename").post(renameFile);
  app.route("/file-sytem/download").post(downloadFile);
  app.route("/file-system/current-path").post(currentPath);
  app.route("file-system/delete").post();
};

export default fileSystemRoutes;
