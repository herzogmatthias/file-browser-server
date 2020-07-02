import { ILoginReqBody } from "../../interfaces/RequestBodies";
import Database from "../../db/database";
import { ILoginResBody } from "../../interfaces/ResponseBodies";
import { comparePassword } from "../../utils/comparePassoword";
import jwt from "jsonwebtoken";
import { config, testConfig } from "../../db/db.config";

export class LoginService {
  async login(body: ILoginReqBody): Promise<ILoginResBody> {
    const db = Database.init(
      process.env.NODE_ENV !== "test" ? config : testConfig
    );
    try {
      const user = await db.getUserByUsername(body.username);
      console.log(user);
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
