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

  getMyLeagues$: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  putMyLeagues$: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  deleteMyLeagues$: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getMyLeagues$Clubs: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  postMyLeagues$Clubs: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  deleteMyLeagues$Clubs$: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
