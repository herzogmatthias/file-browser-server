import { Express } from "express";
import { generatePreview, generatePdf } from "./file.controller";
import { checkToken } from "../../middleware/jwt.middleware";
import { checkPath } from "../../middleware/paths.middleware";

const fileRoutes = (app: Express) => {
  app
    .route("/file/generate-preview")
    .post(checkToken, checkPath, generatePreview);
  app.route("/file/content").post(checkToken, checkPath, generatePdf);
};

export default fileRoutes;
