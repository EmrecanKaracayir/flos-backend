import { NextFunction, Request, Response } from "express";
import { IRefereesService } from "../services/IRefereesService";

export interface IRefereesController {
  readonly refereesService: IRefereesService;

  getReferees: (
    _: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getReferees$: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
