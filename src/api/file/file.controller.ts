import { Response, Request } from "express";
import { FileService } from "./file.service";
import { IRenameReqBody } from "../../interfaces/RequestBodies";
import { IRenameResBody } from "../../interfaces/ResponseBodies";

export const renameFile = async (
  req: Request<{}, IRenameReqBody>,
  res: Response<IRenameResBody>
) => {
  const { oldPath, newPath } = req.body;
  const fileService = new FileService();
  const response = await fileService.renameFile(oldPath, newPath);
  response.hasError ? res.status(500).json(response) : res.json(response);
};
