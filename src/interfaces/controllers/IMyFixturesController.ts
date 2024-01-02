import { NextFunction, Request, Response } from "express";
import { IMyFixturesService } from "../services/IMyFixturesService";

export interface IMyFixturesController {
  readonly myFixturesService: IMyFixturesService;

  getMyFixtures: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getMyFixtures$: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  putMyFixtures$Simulate: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
