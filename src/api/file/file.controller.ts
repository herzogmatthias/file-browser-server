import { Response, Request } from "express";
import { FileService } from "./file.service";
import {
  IGeneratePreviewReqBody,
  IGeneratePdfReqBody,
} from "../../interfaces/RequestBodies";
import {
  IGeneratePreviewResBody,
  IGeneratePdfResBody,
} from "../../interfaces/ResponseBodies";
import { join } from "../../utils/printTreeUtils";
import { pathConfig } from "../../config";

const fileService = new FileService();

export const generatePreview = async (
  req: Request<{}, any, IGeneratePreviewReqBody>,
  res: Response<IGeneratePreviewResBody>
) => {
  const { path, options } = req.body;
  const response = await fileService.generatePreview(path, options);
  response.hasError ? res.status(500).json(response) : res.json(response);
};

export const generatePdf = async (
  req: Request<{}, any, IGeneratePdfReqBody>,
  res: Response<IGeneratePdfResBody>
) => {
  const { path } = req.body;
  const fullpath = join(pathConfig.rootDir, path);
  const response = await fileService.generatePdf(fullpath);
  response.hasError ? res.status(500).json(response) : res.json(response);
};
