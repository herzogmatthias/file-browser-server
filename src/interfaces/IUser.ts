import { IBaseModel } from "./IBaseModel";
import { IPath } from "./IPath";

export interface IUser extends IBaseModel {
  paths: IPath[];
  name: string;
  email: string;
  password: string;
}
