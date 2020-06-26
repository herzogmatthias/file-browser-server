import { Express } from "express";
import { currentDirectory } from "./directory.controller";

const directoryRoutes = (app: Express) => {
  app.route("/directory/current").post(currentDirectory);
};

export default directoryRoutes;
