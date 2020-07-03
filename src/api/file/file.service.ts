import { rename, createWriteStream } from "fs";
import { promisify } from "util";
import {
  IRenameResBody,
  IMoveFileResBody,
  IGeneratePreviewResBody,
  IGeneratePdfResBody,
} from "../../interfaces/ResponseBodies";
import { readFile } from "fs-extra";
import { join } from "path";
import { pathConfig } from "../../config";
import { IPreviewOptions } from "../../interfaces/IPreviewOptions";
import { generatePreviewAsync } from "../../utils/generatePreviewAsync";
import { unoconv } from "../../utils/unoconv";
import { getExt } from "../../utils/printTreeUtils";

export class FileService {
  async generatePreview(
    path: string,
    options: IPreviewOptions
  ): Promise<IGeneratePreviewResBody> {
    try {
      const inPath = join(pathConfig.rootDir, path);
      var name = path.split("/")[path.split("/").length - 1];
      const outPath = join(
        pathConfig.projectDir,
        "..",
        "public",
        "images",
        name.split(".")[0] + ".jpg"
      );
      const response = await generatePreviewAsync(inPath, outPath, options);
      return { hasError: false, outPath: response.thumbnail };
    } catch (err) {
      return { hasError: true, msg: err.message };
    }
  }

  async generatePdf(path: string): Promise<IGeneratePdfResBody> {
    try {
      const ext = getExt(path).split(".")[1];
      const supportedFormats = await unoconv.formats();
      if (supportedFormats.find((sf) => sf.extension === ext)) {
        const res = await unoconv.convert(path);
        return {
          hasError: false,
          fileData: (res as Buffer).toString("base64"),
          base64: true,
        };
      } else {
        const data = await readFile(path, "utf-8");
        return { hasError: false, fileData: data, base64: false };
      }
    } catch (err) {
      return { hasError: true, msg: err.message };
    }
  }
}
