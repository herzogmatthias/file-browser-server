import { createPool, Pool } from "mysql";
import { config } from "./db.config";
import { IUser } from "../interfaces/IUser";
import { IPath } from "../interfaces/IPath";

export default class Database {
  private static instance: Database;
  private dbPool: Pool;
  private constructor() {
    this.dbPool = createPool(config);
  }
  static init(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  getUserByUsername(username: string) {
    return new Promise<IUser | undefined>((res, rej) => {
      this.dbPool.getConnection((err, connection) => {
        connection.query(
          "select id, name, email, password from Users u where u.name = ?",
          username,
          async (err, results) => {
            if (err) rej(err);
            let user: IUser | undefined = undefined;
            if (!results[0]) rej({ msg: "User not found" });
            else {
              user = results[0];
              const paths = await this.pathsForsUser(user!);
              user!.paths = paths;
              connection.release();
              res(user);
            }
          }
        );
      });
    });
  }

  pathsForsUser(user: IUser) {
    return new Promise<IPath[]>((res, rej) => {
      this.dbPool.getConnection((err, connection) => {
        connection.query(
          "select d.path, ud.write, ud.read from Users u, Directories d, UserDirectories ud where u.id = ? and u.id = ud.user_id and d.id = ud.directory_id",
          user.id,
          (err, results) => {
            if (err) throw err;
            let paths: IPath[] = results;
            connection.release();
            res(paths);
          }
        );
      });
    });
  }
}
