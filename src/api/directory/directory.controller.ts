import { Request, Response } from "express";
import { DirectoryService } from "./directory.service";
import { INewDirReqBody } from "../../interfaces/RequestBodies";
import { INewDirResBody } from "../../interfaces/ResponseBodies";
import { IParamDirectory } from "../../interfaces/IParamDirectory";
const directoryService = new DirectoryService();

export const newDirectory = async (
  req: Request<IParamDirectory, any, INewDirReqBody>,
  res: Response<INewDirResBody>
) => {
  const name = req.params.name;
  if (!name)
    return res.status(500).json({ hasError: true, msg: "no name specified" });
  const path = req.body.path;
  const response = await directoryService.newDirectory(path, name);
  return response.hasError
    ? res.status(500).json(response)
    : res.json(response);
};
