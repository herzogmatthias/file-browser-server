import { Express } from "express";
import {
  directoryOverview,
  newDirectory,
  directoryDetails,
} from "./directory.controller";

const directoryRoutes = (app: Express) => {
  app.route("/directory/new/:name").post(newDirectory);
  app.route("/directory/overview").post(directoryOverview);
  app.route("/directory/details").post(directoryDetails);
};

export default directoryRoutes;
