import { rename, createWriteStream } from "fs";
import { promisify } from "util";
import {
  IRenameResBody,
  IMoveFileResBody,
  IGeneratePreviewResBody,
  IGeneratePdfResBody,
} from "../../interfaces/ResponseBodies";
import { move, outputFile, readFile } from "fs-extra";
import archiver from "archiver";
import { join } from "path";
import { pathConfig } from "../../config";
import { IPreviewOptions } from "../../interfaces/IPreviewOptions";
import { generatePreviewAsync } from "../../utils/generatePreviewAsync";
import { unoconv } from "../../utils/unoconv";
import { getExt } from "../../utils/printTreeUtils";
const renameAsync = promisify(rename);

export class FileService {
  async renameFile(oldPath: string, newPath: string): Promise<IRenameResBody> {
    try {
      await renameAsync(oldPath, newPath);
      return {
        hasError: false,
      };
    } catch (err) {
      return {
        hasError: true,
        msg: err.message,
      };
    }
  }

  async copyFiles(
    oldPaths: string[],
    newPath: string
  ): Promise<IMoveFileResBody> {
    const copyPromises: Promise<void>[] = [];
    try {
      for (const oldPath of oldPaths) {
        copyPromises.push(
          move(
            join(pathConfig.rootDir, oldPath),
            join(pathConfig.rootDir, newPath, oldPath.split("/").slice(-1)[0])
          )
        );
      }
      await Promise.all(copyPromises);
      return { hasError: false };
    } catch (err) {
      console.log(err.message);
      return { hasError: true, msg: err.message };
    }
  }

  async zipDirectory(path: string) {
    const out = path + ".zip";
    const archive = archiver("zip", { zlib: { level: 2 } });
    const stream = createWriteStream(out, { flags: "w" });

    return new Promise(async (resolve, reject) => {
      console.log(path);
      archive
        .directory(path, false)
        .on("error", (err) => reject(err))
        .on("warning", (err) => console.log(err))
        .on("progress", (progress) => console.log(progress.entries.processed))
        .on("finish", () => console.log("archiver finished"))
        .on("close", () => console.log("archiver closed"))
        .pipe(stream);
      stream.once("finish", () => {
        console.log("finished");
        resolve(true);
      });
      archive.finalize();
    });
  }

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
