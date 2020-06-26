import { Express } from "express";

const fileRoutes = (app: Express) => {
  app.route("/file/rename").post();
};

export default fileRoutes;
