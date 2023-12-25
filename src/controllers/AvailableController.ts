import { NextFunction, Request, Response } from "express";
import { IAvailableController } from "../interfaces/controllers/IAvailableController";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import { IClientError } from "../interfaces/schemas/responses/app/IClientError";
import { IAvailableClubsRes } from "../interfaces/schemas/responses/routes/available/clubs/IAvailableClubsRes";
import { IAvailableLeaguesRes } from "../interfaces/schemas/responses/routes/available/leagues/IAvailableLeaguesRes";
import { IAvailablePlayersRes } from "../interfaces/schemas/responses/routes/available/player/IAvailablePlayersRes";
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
      const serviceRes: IAppResponse<IAvailableClubsRes[]> =
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
      const serviceRes: IAppResponse<IAvailableLeaguesRes[]> =
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
      const serviceRes: IAppResponse<IAvailablePlayersRes[]> =
        await this.availableService.getAvailablePlayers(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
