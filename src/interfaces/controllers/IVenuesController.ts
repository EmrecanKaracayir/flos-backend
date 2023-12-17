import { NextFunction, Request, Response } from "express";
import { IVenuesService } from "../services/IVenuesService";

export interface IVenuesController {
  readonly venuesService: IVenuesService;

  getVenues: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getVenues$venueId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
