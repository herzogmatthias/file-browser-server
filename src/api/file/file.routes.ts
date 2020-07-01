import { Express } from "express";
import {
  renameFile,
  moveFile,
  downloadFile,
  generatePreview,
  generatePdf,
} from "./file.controller";

const fileRoutes = (app: Express) => {
  app.route("/file/rename").post(renameFile);
  app.route("/file/move").post(moveFile);
  app.route("/file/download").post(downloadFile);
  app.route("/file/generate-preview").post(generatePreview);
  app.route("/file/content").post(generatePdf);
};

export default fileRoutes;
