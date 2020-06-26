import { IDirectory } from "../../interfaces/IDirectory";
import { config } from "../../config";
import { treeJson } from "../../utils/printTree";
import path from "path";
import { ICurrentDirResBody } from "../../interfaces/ResponseBodies";

export class DirectoryService {
  async getCurrentDirectory(paths: string[]): Promise<ICurrentDirResBody> {
    let dir: IDirectory = {
      type: "folder",
      size: 0,
      createdAt: new Date(),
      realPath: "",
      updatedAt: new Date(),
      isSymbolicLink: false,
      path: config.rootDir,
      children: [],
      name: "root",
    };
    if (paths.length > 1) {
      for (const pathName of paths) {
        const item = await treeJson(path.join(config.rootDir, pathName));
        item ? dir.children?.push(item) : null;
      }
    } else {
      dir = (await treeJson(path.join(config.rootDir, paths[0]))) as IDirectory;
    }
    return {
      hasError: false,
      dir: dir,
    };
  }
}
