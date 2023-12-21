import { NextFunction, Request, Response } from "express";
import { IMyLeaguesService } from "../services/IMyLeaguesService";

export interface IMyLeaguesController {
  readonly myLeaguesService: IMyLeaguesService;

  getMyLeagues: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  postMyLeagues: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getMyLeagues$leagueId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
