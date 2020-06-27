import { ILoginReqBody } from "../../interfaces/RequestBodies";
import Database from "../../db/database";
import { ILoginResBody } from "../../interfaces/ResponseBodies";
import { comparePassword } from "../../utils/comparePassoword";
import jwt from "jsonwebtoken";

export class LoginService {
  async login(body: ILoginReqBody): Promise<ILoginResBody> {
    const db = Database.init();

    try {
      const user = await db.getUserByUsername(body.username);
      const isMatch = await comparePassword(body.password, user!.password);
      delete user?.password;
      if (isMatch) {
        const token = jwt.sign({ data: user }, process.env.SECRET!, {
          expiresIn: 604800, //1 week
        });
        return {
          hasError: false,
          token: token,
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
        msg: error.message,
      };
      return err;
    }
  }
}
