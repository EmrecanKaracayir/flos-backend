import { NextFunction, Request, Response } from "express";
import { ILeaguesService } from "../services/ILeaguesService";

export interface ILeaguesController {
  readonly leaguesService: ILeaguesService;

  getLeagues: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getLeagues$leagueId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
