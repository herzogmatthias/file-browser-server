import { Response, Request } from "express";
import { FileService } from "./file.service";
import {
  IRenameReqBody,
  IMoveFileReqBody,
  IDownloadFileReqBody,
} from "../../interfaces/RequestBodies";
import {
  IRenameResBody,
  IMoveFileResBody,
} from "../../interfaces/ResponseBodies";
import { getStats, join } from "../../utils/printTreeUtils";
import { unlink } from "fs-extra";
import { config } from "../../config";

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

export const downloadFile = async (
  req: Request<{}, any, IDownloadFileReqBody>,
  res: Response
) => {
  var path = join(config.rootDir, req.body.path);
  const outPath = path + ".zip";
  const stats = await getStats(path);
  if (stats.isDirectory()) {
    try {
      await fileService.zipDirectory(path);
      console.log("finished zipping");
    } catch (err) {
      res.status(500).json({ hasError: true, msg: err.message });
    }
  }
  res.download(outPath, (err) => {
    if (stats.isDirectory()) {
      unlink(outPath);
    }
  });
};
