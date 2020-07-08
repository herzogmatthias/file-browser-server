import { Request, Response, NextFunction } from "express";
import { urlencoded } from "body-parser";
import { IPath } from "../interfaces/IPath";

const writeOperations = ["move", "delete", "new", "rename"];
const readOperations = [
  "current-path",
  "content",
  "download",
  "generate-preview",
];
export const checkPath = (req: Request, res: Response, next: NextFunction) => {
  for (const key of Object.keys(req.body)) {
    if (key.toLocaleLowerCase().includes("path")) {
      const path = req.body[key];
      console.log(path);
      if (Array.isArray(path)) {
        for (const p of path) {
          const profilePath = req.decoded?.paths.find((pp) =>
            p.includes(pp.path.toLocaleLowerCase())
          );
          return validatePath(profilePath, p, req.url, res, next);
        }
      } else {
        const profilePath = req.decoded?.paths.find((p) =>
          path.includes(p.path.toLocaleLowerCase())
        );
        return validatePath(profilePath, path, req.url, res, next);
      }
    }
  }
};

const validatePath = (
  profilePath: IPath | undefined,
  path: string,
  url: string,
  res: Response,
  next: NextFunction
) => {
  if (profilePath) {
    if (profilePath.read && profilePath.write) {
      console.log(`${profilePath} read and write`);
      next();
      return;
    } else if (
      (profilePath.read &&
        !profilePath.write &&
        writeOperations.some((wo) => url.includes(wo))) ||
      (!profilePath.read &&
        profilePath.write &&
        readOperations.some((ro) => url.includes(ro)))
    ) {
      return res.status(403).json({ hasError: true, msg: "permission denied" });
    } else {
      next();
      return;
    }
  } else {
    return res.status(403).json({
      hasError: true,
      msg: `You are not allowed to access path: ${path}`,
    });
  }
};
