import { IUser } from "./IUser";
import { IBaseErrorModel } from "./IBaseErrorModel";
import { IDirectory } from "./IDirectory";

export interface ILoginResBody extends IBaseErrorModel {
  user?: IUser;
  token?: string;
}

export interface ICurrentDirResBody extends IBaseErrorModel {
  dir: IDirectory;
}

export interface IRenameResBody extends IBaseErrorModel {}
