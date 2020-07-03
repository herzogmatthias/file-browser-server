import { IDirectoryOerview } from "./IDirectoryOverview";

export interface IDirectory {
  size?: number;
  createdAt: Date;
  updatedAt: Date;
  items?: number;
  name: string;
  path: string;
  relativePath: string;
  extension?: string;
  type: string;
  children?: IDirectoryOerview[];
}
