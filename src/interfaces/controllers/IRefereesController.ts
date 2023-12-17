import { NextFunction, Request, Response } from "express";
import { IRefereesService } from "../services/IRefereesService";

export interface IRefereesController {
  readonly refereesService: IRefereesService;

  getReferees: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getReferees$refereeId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
