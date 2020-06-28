import { IPreviewOptions } from "./IPreviewOptions";

export interface ILoginReqBody {
  password: string;
  username: string;
}

export interface IDirOverviewReqBody {
  paths: string[];
}

export interface IRenameReqBody {
  oldPath: string;
  newPath: string;
}

export interface INewDirReqBody {
  path: string;
}

export interface IMoveFileReqBody {
  oldPaths: string[];
  newPath: string;
}

export interface IDirDetailsReqBody {
  path: string;
}
export interface IDownloadFileReqBody {
  path: string;
}
export interface IGeneratePreviewReqBody {
  path: string;
  options: IPreviewOptions;
}
