export interface ILoginReqBody {
  password: string;
  username: string;
}

export interface ICurrentDirReqBody {
  paths: string[];
}

export interface IRenameReqBody {
  oldPath: string;
  newPath: string;
}
