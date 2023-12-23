import { NextFunction, Request, Response } from "express";
import { IMyClubService } from "../services/IMyClubService";

export interface IMyClubController {
  readonly myClubService: IMyClubService;

  getMyClub: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  postMyClub: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
