import { PoolConfig } from "mysql";

console.log(process.env.DB_USER);

export const config: PoolConfig = {
  host: process.env.DB_HOST,
  connectionLimit: Number(process.env.DB_CONNECTIONLIMIT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
