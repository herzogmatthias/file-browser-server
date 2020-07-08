import { Express } from "express";
import { newDirectory } from "./directory.controller";
import { checkToken } from "../../middleware/jwt.middleware";
import { checkPath } from "../../middleware/paths.middleware";

const directoryRoutes = (app: Express) => {
  app.route("/directory/new/:name").post(checkToken, checkPath, newDirectory);
};

export default directoryRoutes;
