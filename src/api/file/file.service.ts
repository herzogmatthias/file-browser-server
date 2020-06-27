import { rename, createWriteStream } from "fs";
import { promisify } from "util";
import {
  IRenameResBody,
  IMoveFileResBody,
} from "../../interfaces/ResponseBodies";
import { move } from "fs-extra";
import archiver from "archiver";
import { join } from "path";
import { config } from "../../config";
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
            join(config.rootDir, oldPath),
            join(config.rootDir, newPath, oldPath.split("/").slice(-1)[0])
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
}
