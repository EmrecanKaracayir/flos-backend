import { NextFunction, Request, Response } from "express";
import { IAvailableController } from "../interfaces/controllers/IAvailableController";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import { IClientError } from "../interfaces/schemas/responses/common/IClientError";
import { IClubsResData } from "../interfaces/schemas/responses/routes/clubs/IClubsResData";
import { ILeaguesResData } from "../interfaces/schemas/responses/routes/leagues/ILeaguesResData";
import { IPlayersResData } from "../interfaces/schemas/responses/routes/players/IPlayersResData";
import { IAvailableService } from "../interfaces/services/IAvailableService";
import { AvailableService } from "../services/AvailableService";

export class AvailableController implements IAvailableController {
  public readonly availableService: IAvailableService;

  constructor() {
    this.availableService = new AvailableService();
  }

  public async getAvailableClubs(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      // Hand over to service
      const serviceRes: IGenericResponse<IClubsResData[]> =
        await this.availableService.getAvailableClubs(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async getAvailableLeagues(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      // Hand over to service
      const serviceRes: IGenericResponse<ILeaguesResData[]> =
        await this.availableService.getAvailableLeagues(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async getAvailablePlayers(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      // Hand over to service
      const serviceRes: IGenericResponse<IPlayersResData[]> =
        await this.availableService.getAvailablePlayers(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
