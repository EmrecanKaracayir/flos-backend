import { NextFunction, Request, Response } from "express";
import { ILoginService } from "../services/ILoginService";

export interface ILoginController {
  readonly loginService: ILoginService;

  loginOrganizer: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  loginParticipant: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
