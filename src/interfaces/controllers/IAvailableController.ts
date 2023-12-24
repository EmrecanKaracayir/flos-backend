import { NextFunction, Request, Response } from "express";
import { IAvailableService } from "../services/IAvailableService";

export interface IAvailableController {
  readonly availableService: IAvailableService;

  getAvailableClubs: (
    _: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getAvailableLeagues: (
    _: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getAvailablePlayers: (
    _: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
