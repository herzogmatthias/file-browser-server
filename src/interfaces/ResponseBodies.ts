import { IUser } from "./IUser";
import { IBaseErrorModel } from "./IBaseErrorModel";
import { IDirectory } from "./IDirectory";
import { IDirectoryOerview } from "./IDirectoryOverview";

export interface ILoginResBody extends IBaseErrorModel {
  user?: IUser;
  token?: string;
}

export interface ICurrentPathResBody extends IBaseErrorModel {
  dir?: IDirectory;
}

export interface IRenameResBody extends IBaseErrorModel {}
export interface INewDirResBody extends IBaseErrorModel {
  dir?: IDirectory;
}
export interface IMoveFileResBody extends IBaseErrorModel {}
export interface IDirDetailsResBody extends IBaseErrorModel {
  details?: IDirectory;
}
export interface IGeneratePreviewResBody extends IBaseErrorModel {
  outPath?: string;
}

export interface IGeneratePdfResBody extends IBaseErrorModel {
  buffer?: Buffer;
  fileData?: string;
  base64?: boolean;
}

export interface IDeleteResBody extends IBaseErrorModel {}
