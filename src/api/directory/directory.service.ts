import { IDirectory } from "../../interfaces/IDirectory";
import { pathConfig } from "../../config";
import { treeJson } from "../../utils/printTree";
import path from "path";
import { mkdir, lstat } from "fs";
import { promisify } from "util";
const mkdirAsync = promisify(mkdir);
const lstatAsync = promisify(lstat);
import {
  IDirOverviewResBody,
  INewDirResBody,
  IDirDetailsResBody,
} from "../../interfaces/ResponseBodies";
import { IDirectoryOerview } from "../../interfaces/IDirectoryOverview";
import { getStats, join, getDirData, getExt } from "../../utils/printTreeUtils";

export class DirectoryService {
  async getDirectoryOverview(paths: string[]): Promise<IDirOverviewResBody> {
    let dir: IDirectoryOerview = {
      type: "folder",
      relativePath: "",

      path: pathConfig.rootDir,
      children: [],
      name: "root",
    };
    if (paths.length > 1) {
      dir.relativePath = "/";
      for (const pathName of paths) {
        const item = await treeJson(path.join(pathConfig.rootDir, pathName));
        item ? (item.relativePath = pathName) : null;
        item ? dir.children?.push(item) : null;
      }
    } else {
      dir = (await treeJson(path.join(pathConfig.rootDir, paths[0]), {
        level: 1,
        onlyDir: false,
        showHiddenFiles: false,
      })) as IDirectory;
      dir.relativePath = paths[0];
    }

    return {
      hasError: false,
      dir: dir,
    };
  }

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
        realPath: "",
        isSymbolicLink: false,
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
  async getDirectoryDetails(path: string): Promise<IDirDetailsResBody> {
    const fullpath = join(pathConfig.rootDir, path);
    try {
      let dir: IDirectory = {
        name: path.split("/").slice(-1)[0],
        relativePath: path,
        path: fullpath,
        createdAt: new Date(),
        updatedAt: new Date(),
        realPath: "",
        isSymbolicLink: false,
        size: 0,
        type: "",
      };
      const stats = await getStats(fullpath);
      dir.isSymbolicLink = stats.isSymbolicLink();
      dir.updatedAt = stats.mtime;
      dir.createdAt = stats.ctime;
      if (stats.isDirectory()) {
        let dirData = await getDirData(fullpath);
        if (dirData === null)
          return { hasError: true, msg: "No data available" };
        dir.type = "Directory";
        let size = 0;
        for (let i = 0; i < dirData.length; i++) {
          const child = dirData[i];
          size += (await lstatAsync(join(fullpath, child))).size;
        }
        dir.size = size;
      } else {
        (dir.type = "File"),
          (dir.size = stats.size),
          (dir.extension = getExt(fullpath));
      }
      return {
        hasError: false,
        details: dir,
      };
    } catch (err) {
      return { hasError: true, msg: err.message };
    }
  }
}
