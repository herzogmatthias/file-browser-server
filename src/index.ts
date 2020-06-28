import express from "express";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";
import loginRoutes from "./api/login/login.routes";
import * as dotenv from "dotenv";
import directoryRoutes from "./api/directory/directory.routes";
import fileRoutes from "./api/file/file.routes";
import { join } from "path";
import { unoconvListener } from "./utils/unoconvListener";

process.env.NODE_ENV !== "production" ? dotenv.config() : null;
express.Router({ mergeParams: true });
const app = express();
var port = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use("/private", express.static(join(__dirname, "public")));
app.use(helmet());
unoconvListener();
loginRoutes(app);
directoryRoutes(app);
fileRoutes(app);
app.listen(port, function () {
  console.log("Server started on port: " + port);
});
