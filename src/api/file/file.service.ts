import { rename } from "fs";
import { promisify } from "util";
import { IRenameResBody } from "../../interfaces/ResponseBodies";
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
        msg: err.msg,
      };
    }
  }
}
