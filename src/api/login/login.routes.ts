import { Express } from "express";
import { login } from "./login.controller";

const loginRoutes = (app: Express) => {
  app.route("/login").post(login);
};

export default loginRoutes;
