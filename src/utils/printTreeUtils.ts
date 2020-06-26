import fs from "fs";
import path from "path";
import { promisify } from "util";
import du from "du";
const lstat = promisify(fs.lstat);
const readdir = promisify(fs.readdir);
const realpathAsync = promisify(fs.realpath);

function isRegExp(regExp: RegExp | RegExp[]) {
  return typeof regExp === "object" && regExp.constructor === RegExp;
}
function getName(fullPath: string) {
  return path.basename(fullPath);
}
function getStats(fullPath: string) {
  return lstat(fullPath);
}
function getExt(fullPath: string) {
  return path.extname(fullPath).toLowerCase();
}
async function getDirData(fullPath: string) {
  let dirData: string[] = [];
  try {
    dirData = await readdir(fullPath);
  } catch (e) {
    // User does not have permissions, ignore directory
    if (e.code === "EACCES") return null;
    throw e;
  }
  return dirData;
}

function normalize(fullPath: string) {
  return path.resolve(fullPath);
}
function join(fullPath: string, child: string) {
  return path.join(fullPath, child);
}
function realPath(fullPath: string) {
  return realpathAsync(fullPath);
}
async function getFolderSize(fullPath: string) {
  return du(fullPath);
}
export {
  isRegExp,
  getDirData,
  getExt,
  getStats,
  getName,
  normalize,
  join,
  realPath,
  getFolderSize,
};
