import { IBaseModel } from "./IBaseModel";

export interface IPath extends IBaseModel {
  path: string;
  read: number;
  write: number;
}
