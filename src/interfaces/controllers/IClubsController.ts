import { NextFunction, Request, Response } from "express";
import { IClubsService } from "../services/IClubsService";

export interface IClubsController {
  readonly clubsService: IClubsService;

  getClubs: (
    _: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getClubs$: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
