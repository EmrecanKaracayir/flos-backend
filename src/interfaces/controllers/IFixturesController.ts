import { NextFunction, Request, Response } from "express";
import { IFixturesService } from "../services/IFixturesService";

export interface IFixturesController {
  readonly fixturesService: IFixturesService;

  getFixtures: (
    _: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getFixtures$: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
