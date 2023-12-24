import { NextFunction, Request, Response } from "express";
import { IPlayersService } from "../services/IPlayersService";

export interface IPlayersController {
  readonly playersService: IPlayersService;

  getPlayers: (
    _: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getPlayers$playerId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}
