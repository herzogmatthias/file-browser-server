import { Request, Response } from "express";
import { DirectoryService } from "./directory.service";
import {
  IDirOverviewReqBody,
  INewDirReqBody,
  IDirDetailsReqBody,
} from "../../interfaces/RequestBodies";
import {
  IDirOverviewResBody,
  INewDirResBody,
  IDirDetailsResBody,
} from "../../interfaces/ResponseBodies";
import { IParamDirectory } from "../../interfaces/IParamDirectory";
const directoryService = new DirectoryService();
export const directoryOverview = async (
  req: Request<{}, any, IDirOverviewReqBody>,
  res: Response<IDirOverviewResBody>
) => {
  const { paths } = req.body;

  const response = await directoryService.getDirectoryOverview(paths);
  response.hasError ? res.status(500).json(response) : res.json(response);
};

export const newDirectory = async (
  req: Request<IParamDirectory, any, INewDirReqBody>,
  res: Response<INewDirResBody>
) => {
  const name = req.params.name;
  const path = req.body.path;
  const response = await directoryService.newDirectory(path, name);
  response.hasError ? res.status(500).json(response) : res.json(response);
};

export const directoryDetails = async (
  req: Request<{}, any, IDirDetailsReqBody>,
  res: Response<IDirDetailsResBody>
) => {
  const path = req.body.path;
  const response = await directoryService.getDirectoryDetails(path);
  response.hasError ? res.status(500).json(response) : res.json(response);
};
