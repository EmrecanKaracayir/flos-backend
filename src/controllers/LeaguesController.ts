import { NextFunction, Request, Response } from "express";
import { canParseToInt } from "../core/utils/strings";
import { ILeaguesController } from "../interfaces/controllers/ILeaguesController";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/common/IHttpStatus";
import { ILeaguesResData } from "../interfaces/schemas/responses/routes/leagues/ILeaguesResData";
import { ILeaguesService } from "../interfaces/services/ILeaguesService";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
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
      const serviceRes: IGenericResponse<ILeaguesResData[]> =
        await this.leaguesService.getLeagues(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async getLeagues$leagueId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!req.params.leagueId) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_$LEAGUE_ID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new GenericResponse<null>(
              httpStatus,
              null,
              clientErrors,
              null,
              null,
            ),
          );
      }
      if (!canParseToInt(req.params.leagueId)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_PARAMETER_$LEAGUE_ID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new GenericResponse<null>(
              httpStatus,
              null,
              clientErrors,
              null,
              null,
            ),
          );
      }
      // Hand over to service
      const serviceRes: IGenericResponse<ILeaguesResData | null> =
        await this.leaguesService.getLeagues$leagueId(
          parseInt(req.params.leagueId),
          clientErrors,
        );
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
