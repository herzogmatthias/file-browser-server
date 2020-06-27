import { Response, Request } from "express";
import { FileService } from "./file.service";
import {
  IRenameReqBody,
  IMoveFileReqBody,
} from "../../interfaces/RequestBodies";
import {
  IRenameResBody,
  IMoveFileResBody,
} from "../../interfaces/ResponseBodies";

const fileService = new FileService();

export const renameFile = async (
  req: Request<{}, any, IRenameReqBody>,
  res: Response<IRenameResBody>
) => {
  const { oldPath, newPath } = req.body;

  const response = await fileService.renameFile(oldPath, newPath);
  response.hasError ? res.status(500).json(response) : res.json(response);
};

export const moveFile = async (
  req: Request<{}, any, IMoveFileReqBody>,
  res: Response<IMoveFileResBody>
) => {
  const { oldPaths, newPath } = req.body;
  const response = await fileService.copyFiles(oldPaths, newPath);
  response.hasError ? res.status(500).json(response) : res.json(response);
};
