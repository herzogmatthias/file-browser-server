import { Express } from "express";
import { generatePreview, generatePdf } from "./file.controller";

const fileRoutes = (app: Express) => {
  app.route("/file/generate-preview").post(generatePreview);
  app.route("/file/content").post(generatePdf);
};

export default fileRoutes;
