import {
  normalize,
  getName,
  isRegExp,
  getStats,
  getExt,
  getDirData,
  join,
} from "./printTreeUtils";
import { IOptions } from "../interfaces/IOptions";
import { IDirectoryOerview } from "../interfaces/IDirectoryOverview";
import { IDirectory } from "../interfaces/IDirectory";

const constants = {
  DIRECTORY: "Directory",
  FILE: "File",
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
    relativePath: "",
    path,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [],
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
  item.createdAt = stats.ctime;
  item.updatedAt = stats.mtime;
  if (stats.isFile()) {
    if (onlyDir) return false;
    const ext = getExt(path);
    item.size = stats.size;
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
    item.items = dirData?.length;
    if (dirData === null) return false;
    const level = myLevel + 1;
    item.type = constants.DIRECTORY;
    item.children = [];
    for (let i = 0; i < dirData.length; i++) {
      const child = dirData[i];

      const data = await treeJson(join(path, child), options, level);
      if (data) item.children.push(data);
    }
  }
  return item;
}
