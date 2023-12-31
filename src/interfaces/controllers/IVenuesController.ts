import { NextFunction, Request, Response } from "express";
import { IVenuesService } from "../services/IVenuesService";

export interface IVenuesController {
  readonly venuesService: IVenuesService;

  getVenues: (
    _: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getVenues$: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
