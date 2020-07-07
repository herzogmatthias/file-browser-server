import {
  ICurrentPathReqBody,
  IRenameReqBody,
  IMoveFileReqBody,
  IDownloadFileReqBody,
  IDeleteReqBody,
} from "../../interfaces/RequestBodies";
import {
  ICurrentPathResBody,
  IRenameResBody,
  IMoveFileResBody,
  IDeleteResBody,
} from "../../interfaces/ResponseBodies";
import { Request, Response } from "express";
import { join } from "path";
import { FileSystemService } from "./file-system.service";
import { pathConfig } from "../../config";
import { getStats } from "../../utils/printTreeUtils";
import { unlink, existsSync } from "fs-extra";

const fileSystemService = new FileSystemService();

export const currentPath = async (
  req: Request<{}, any, ICurrentPathReqBody>,
  res: Response<ICurrentPathResBody>
) => {
  const { paths } = req.body;

  const response = await fileSystemService.currentPath(paths);
  response.hasError ? res.status(500).json(response) : res.json(response);
};

export const renameFile = async (
  req: Request<{}, any, IRenameReqBody>,
  res: Response<IRenameResBody>
) => {
  const { oldPath, newPath } = req.body;

  const response = await fileSystemService.renameFile(oldPath, newPath);
  response.hasError ? res.status(500).json(response) : res.json(response);
};

export const moveFile = async (
  req: Request<{}, any, IMoveFileReqBody>,
  res: Response<IMoveFileResBody>
) => {
  const { oldPaths, newPath } = req.body;
  const response = await fileSystemService.moveFiles(oldPaths, newPath);
  response.hasError ? res.status(500).json(response) : res.json(response);
};

export const downloadFile = async (
  req: Request<{}, any, IDownloadFileReqBody>,
  res: Response
) => {
  var path = join(pathConfig.rootDir, req.body.path);
  if (!existsSync(path))
    return res
      .status(500)
      .json({ hasError: true, msg: "Path does not exist!" });
  const outPath = path + ".zip";
  const stats = await getStats(path);
  if (stats.isDirectory()) {
    try {
      await fileSystemService.zipDirectory(path);
    } catch (err) {
      res.status(500).json({ hasError: true, msg: err.message });
    }
  }
  res.download(stats.isDirectory() ? outPath : path, (err) => {
    if (stats.isDirectory()) {
      unlink(outPath);
    }
  });
};

export const deleteFiles = async (
  req: Request<{}, any, IDeleteReqBody>,
  res: Response<IDeleteResBody>
) => {
  const { paths } = req.body;
  const response = await fileSystemService.deleteFiles(paths);
  response.hasError ? res.status(500).json(response) : res.json(response);
};
