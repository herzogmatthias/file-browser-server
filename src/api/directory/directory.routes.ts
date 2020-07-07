import { Express } from "express";
import { newDirectory } from "./directory.controller";
import { checkToken } from "../../middleware/jwt.middleware";

const directoryRoutes = (app: Express) => {
  app.route("/directory/new/:name").post(checkToken, newDirectory);
};

export default directoryRoutes;
