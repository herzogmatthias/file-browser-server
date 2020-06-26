import { Request, Response } from "express";
import { ILoginReqBody } from "../../interfaces/RequestBodies";
import { LoginService } from "./login.service";
import { ILoginResBody } from "../../interfaces/ResponseBodies";

export const login = async (
  req: Request<{}, any, ILoginReqBody>,
  res: Response<ILoginResBody>
) => {
  const loginService = new LoginService();
  const resBody = await loginService.login(req.body);
  if (resBody.hasError) {
    res.status(500).json(resBody);
  } else {
    res.json(resBody);
  }
};
