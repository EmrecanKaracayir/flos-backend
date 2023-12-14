import { NextFunction, Request, Response } from "express";

export interface ILoginController {
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
