import { IDirectory } from "../../interfaces/IDirectory";
import { pathConfig } from "../../config";
import path from "path";
import { mkdir, lstat } from "fs";
import { promisify } from "util";
const mkdirAsync = promisify(mkdir);
const lstatAsync = promisify(lstat);
import { INewDirResBody } from "../../interfaces/ResponseBodies";

export class DirectoryService {
  async newDirectory(pathName: string, name: string): Promise<INewDirResBody> {
    try {
      await mkdirAsync(path.join(pathConfig.rootDir, pathName, name));
      const stats = await lstatAsync(path.join(pathName, name));
      let dir: IDirectory = {
        name,
        relativePath: pathName,
        path: path.join(pathName, name),
        createdAt: stats.ctime,
        updatedAt: stats.mtime,
        size: stats.size,
        type: "Directory",
        children: [],
      };
      return {
        hasError: false,
        dir,
      };
    } catch (err) {
      return {
        hasError: true,
        msg: err.message,
      };
    }
  }
}
