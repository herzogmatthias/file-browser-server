import { Express } from "express";
import { generatePreview, generatePdf } from "./file.controller";
import { checkToken } from "../../middleware/jwt.middleware";

const fileRoutes = (app: Express) => {
  app.route("/file/generate-preview").post(checkToken, generatePreview);
  app.route("/file/content").post(checkToken, generatePdf);
};

export default fileRoutes;
