import { Request, Response } from "express";
import { DirectoryService } from "./directory.service";
import { ICurrentDirReqBody } from "../../interfaces/RequestBodies";
import { ICurrentDirResBody } from "../../interfaces/ResponseBodies";

export const currentDirectory = async (
  req: Request<{}, ICurrentDirReqBody>,
  res: Response<ICurrentDirResBody>
) => {
  const { paths } = req.body;
  const directoryService = new DirectoryService();
  const response = await directoryService.getCurrentDirectory(paths);
  response.hasError ? res.status(500).json(response) : res.json(response);
};
