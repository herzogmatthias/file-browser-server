import { Express } from "express";
import { newDirectory } from "./directory.controller";

const directoryRoutes = (app: Express) => {
  app.route("/directory/new/:name").post(newDirectory);
};

export default directoryRoutes;
