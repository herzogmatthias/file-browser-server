import { IDirectoryOerview } from "./IDirectoryOverview";

export interface IDirectory extends IDirectoryOerview {
  size: number;
  createdAt: Date;
  updatedAt: Date;
  isSymbolicLink: boolean;
  realPath: string;
}
