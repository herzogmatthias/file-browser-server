import { rename } from "fs";
import { promisify } from "util";
import {
  IRenameResBody,
  IMoveFileResBody,
} from "../../interfaces/ResponseBodies";
import { move } from "fs-extra";

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
}
