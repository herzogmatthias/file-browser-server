import { IDirectory } from "../../interfaces/IDirectory";
import { pathConfig } from "../../config";
import { treeJson } from "../../utils/printTree";
import { join } from "path";
import { rename, move, createWriteStream, remove, existsSync } from "fs-extra";
import {
  IRenameResBody,
  IMoveFileResBody,
  IDeleteResBody,
} from "../../interfaces/ResponseBodies";
import archiver from "archiver";

export class FileSystemService {
  async currentPath(paths: string[]) {
    let dir: IDirectory = {
      type: "folder",
      relativePath: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      path: pathConfig.rootDir,
      children: [],
      name: "root",
    };
    if (paths.length > 1) {
      dir.relativePath = "/";
      for (const pathName of paths) {
        const item = await treeJson(join(pathConfig.rootDir, pathName));
        item ? (item.relativePath = pathName) : null;
        item ? dir.children?.push(item) : null;
      }
    } else {
      dir = (await treeJson(join(pathConfig.rootDir, paths[0]), {
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
  async renameFile(oldPath: string, newPath: string): Promise<IRenameResBody> {
    try {
      await rename(oldPath, newPath);
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
  async moveFiles(
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
      return { hasError: true, msg: err.message };
    }
  }
  async zipDirectory(path: string) {
    const out = path + ".zip";
    const archive = archiver("zip", { zlib: { level: 2 } });
    const stream = createWriteStream(out, { flags: "w" });

    return new Promise(async (resolve, reject) => {
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

  async deleteFiles(paths: string[]) {
    const deletePromises: Promise<void>[] = [];
    try {
      for (let path of paths) {
        const fullPath = join(pathConfig.rootDir, path);
        if (existsSync(fullPath)) {
          deletePromises.push(remove(fullPath));
        } else {
          return { hasError: true, msg: `${fullPath} does not exist` };
        }
      }
      await Promise.all(deletePromises);
      return { hasError: false };
    } catch (err) {
      return { hasError: true, msg: err.message };
    }
  }
}
