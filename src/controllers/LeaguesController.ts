import { NextFunction, Request, Response } from "express";
import { canParseToInt } from "../core/utils/strings";
import { ILeaguesController } from "../interfaces/controllers/ILeaguesController";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { ILeaguesRes } from "../interfaces/schemas/responses/routes/leagues/ILeaguesRes";
import { ILeaguesService } from "../interfaces/services/ILeaguesService";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { LeaguesService } from "../services/LeaguesService";

export class LeaguesController implements ILeaguesController {
  public readonly leaguesService: ILeaguesService;

  constructor() {
    this.leaguesService = new LeaguesService();
  }

  public async getLeagues(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      // Hand over to service
      const serviceRes: IAppResponse<ILeaguesRes[]> =
        await this.leaguesService.getLeagues(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async getLeagues$(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!req.params.leagueId) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_$LGID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      if (!canParseToInt(req.params.leagueId)) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_PARAMETER_$LGID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<ILeaguesRes | null> =
        await this.leaguesService.getLeagues$(
          parseInt(req.params.leagueId),
          clientErrors,
        );
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
