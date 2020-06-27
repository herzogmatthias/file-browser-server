import { IUser } from "./IUser";
import { IBaseErrorModel } from "./IBaseErrorModel";
import { IDirectory } from "./IDirectory";
import { IDirectoryOerview } from "./IDirectoryOverview";

export interface ILoginResBody extends IBaseErrorModel {
  user?: IUser;
  token?: string;
}

export interface IDirOverviewResBody extends IBaseErrorModel {
  dir: IDirectoryOerview;
}

export interface IRenameResBody extends IBaseErrorModel {}
export interface INewDirResBody extends IBaseErrorModel {
  dir?: IDirectory;
}
export interface IMoveFileResBody extends IBaseErrorModel {}
export interface IDirDetailsResBody extends IBaseErrorModel {
  details?: IDirectory;
}
