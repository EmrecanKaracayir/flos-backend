import { NextFunction, Request, Response } from "express";
import { IMyPlayerService } from "../services/IMyPlayerService";

export interface IMyPlayerController {
  readonly myPlayerService: IMyPlayerService;

  getMyPlayer: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  postMyPlayer: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  putMyPlayer: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  deleteMyPlayer: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  deleteMyPlayerResign: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
