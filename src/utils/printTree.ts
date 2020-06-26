import {
  normalize,
  getName,
  isRegExp,
  getStats,
  realPath,
  getExt,
  getDirData,
  join,
} from "./printTreeUtils";
import { IOptions } from "../interfaces/IOptions";
import { IDirectory } from "../interfaces/IDirectory";

const constants = {
  DIRECTORY: "directory",
  FILE: "file",
};

export async function treeJson(
  path: string,
  options: IOptions = { level: 1, onlyDir: false, showHiddenFiles: false },
  myLevel?: number
) {
  if (!myLevel) {
    myLevel = 0;
  }
  const { level, exclude, extensions, onlyDir, showHiddenFiles } = options;
  if (level <= 0) throw new Error("Level invalid should to be > 0");
  if (level === myLevel) {
    return false;
  }
  path = normalize(path);
  const name = getName(path);
  if (exclude) {
    const excludes = (isRegExp(exclude) ? [exclude] : exclude) as RegExp[];
    if (excludes.some((exclusion) => exclusion.test(name))) {
      return false;
    }
  }
  const item: IDirectory = {
    type: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isSymbolicLink: false,
    path,
    realPath: "",
    name,
    size: 0,
  };
  if (name.charAt(0) === "." && !showHiddenFiles) {
    return false;
  }
  let stats;

  try {
    stats = await getStats(path);
  } catch (e) {
    if (myLevel === 0) throw e;
    return false;
  }

  item.size = stats.size;
  item.isSymbolicLink = stats.isSymbolicLink();
  item.createdAt = stats.birthtime;
  item.updatedAt = stats.mtime;
  if (item.isSymbolicLink) {
    item.realPath = await realPath(path);
  }
  if (stats.isFile()) {
    if (onlyDir) return false;
    const ext = getExt(path);
    if (
      ext.length > 0 &&
      extensions &&
      isRegExp(extensions) &&
      !extensions.test(ext)
    )
      return false;
    item.extension = ext;
    item.type = constants.FILE;
  }
  if (stats.isDirectory()) {
    let dirData = await getDirData(path);
    if (dirData === null) return false;
    const level = myLevel + 1;
    item.type = constants.DIRECTORY;
    item.children = [];
    let size = 0;
    for (let i = 0; i < dirData.length; i++) {
      const child = dirData[i];
      if (level === 1) {
        size += (await getStats(join(path, child))).size;
      } else {
        const data = await treeJson(join(path, child), options, level);
        if (data) item.children.push(data);
      }
    }
    item.size =
      level > 1
        ? item.children.reduce((prev, child) => prev + child.size, 0)
        : size;
  }
  return item;
}
