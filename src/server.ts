import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";
import loginRoutes from "./api/login/login.routes";

import directoryRoutes from "./api/directory/directory.routes";
import fileRoutes from "./api/file/file.routes";
import { join } from "path";
import { unoconv } from "./utils/unoconv";

express.Router({ mergeParams: true });
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use("/private", express.static(join(__dirname, "public")));
app.use(helmet());
unoconv.listener();
loginRoutes(app);
directoryRoutes(app);
fileRoutes(app);
export { app };
