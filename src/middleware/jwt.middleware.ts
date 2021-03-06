import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  let token: string =
    (req.headers["x-access-token"] as string) ||
    (req.headers["authorization"] as string); // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, process.env.SECRET!, (err, decoded: any) => {
      if (err) {
        res.status(500).json({
          hasError: true,
          msg: "Token is not valid",
        });
      } else {
        req.decoded = decoded.data as IUser;
        next();
      }
    });
  } else {
    res.status(500).json({
      hasError: true,
      msg: "Auth token is not supplied",
    });
  }
};
