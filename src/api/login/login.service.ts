import { ILoginReqBody } from "../../interfaces/RequestBodies";
import Database from "../../db/database";
import { ILoginResBody } from "../../interfaces/ResponseBodies";
import { comparePassword } from "../../services/comparePassoword";

export class LoginService {
  async login(body: ILoginReqBody): Promise<ILoginResBody> {
    const db = Database.init();

    try {
      const user = await db.getUserByUsername(body.username);
      const isMatch = await comparePassword(body.password, user!.password);
      if (isMatch) {
        return {
          hasError: false,
          user: user,
        };
      } else {
        return {
          hasError: true,
          msg: "Password didn't match",
        };
      }
    } catch (error) {
      const err: ILoginResBody = {
        hasError: true,
        msg: error.msg,
      };
      return err;
    }
  }
}
