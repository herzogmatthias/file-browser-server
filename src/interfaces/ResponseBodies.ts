import { IUser } from "./IUser";

export interface ILoginResBody {
  user?: IUser;
  hasError: boolean;
  msg?: string;
}
