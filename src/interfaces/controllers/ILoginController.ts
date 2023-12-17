import { NextFunction, Request, Response } from "express";
import { ILoginService } from "../services/ILoginService";

export interface ILoginController {
  readonly loginService: ILoginService;

  postLoginOrganizer: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  postLoginParticipant: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
