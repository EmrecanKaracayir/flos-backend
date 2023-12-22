import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { canParseToInt } from "../core/utils/strings";
import { IMyLeaguesController } from "../interfaces/controllers/IMyLeaguesController";
import { IMyLeaguesReqDto } from "../interfaces/schemas/requests/routes/my/leagues/IMyLeaguesReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/common/IHttpStatus";
import { IMyLeaguesResData } from "../interfaces/schemas/responses/routes/my/leagues/IMyLeaguesResData";
import { IMyLeaguesService } from "../interfaces/services/IMyLeaguesService";
import { MyLeaguesReqDto } from "../schemas/requests/routes/my/leagues/MyLeaguesReqDto";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { MyLeaguesService } from "../services/MyLeaguesService";

export class MyLeaguesController implements IMyLeaguesController {
  public readonly myLeaguesService: IMyLeaguesService;

  constructor() {
    this.myLeaguesService = new MyLeaguesService();
  }

  public async getMyLeagues(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      // Parse token (Has to be valid, otherwise it would not have reached this point)
      const authPayload: AuthPayload = AuthHelper.verifyToken(
        req.headers.authorization!.split(" ")[1],
      );
      // Hand over to service
      const serviceRes: IGenericResponse<IMyLeaguesResData[]> =
        await this.myLeaguesService.getMyLeagues(
          authPayload.userId,
          clientErrors,
        );
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async postMyLeagues(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyLeaguesReqDto.isValidDto(req.body)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_REQUEST_BODY),
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
      // Parse token (Has to be valid, otherwise it would not have reached this point)
      const authPayload: AuthPayload = AuthHelper.verifyToken(
        req.headers.authorization!.split(" ")[1],
      );
      // Hand over to service
      const serviceRes: IGenericResponse<IMyLeaguesResData | null> =
        await this.myLeaguesService.postMyLeagues(
          authPayload.userId,
          req.body as IMyLeaguesReqDto,
          clientErrors,
        );
      if (!serviceRes.data) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Generate token
      const token: string = AuthHelper.generateToken(authPayload);
      // Respond with token
      return res
        .status(serviceRes.httpStatus.code)
        .send(
          new GenericResponse<IMyLeaguesResData>(
            serviceRes.httpStatus,
            serviceRes.serverError,
            serviceRes.clientErrors,
            serviceRes.data,
            token,
          ),
        );
    } catch (error) {
      return next(error);
    }
  }

  public async getMyLeagues$leagueId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      // Parse token (Has to be valid, otherwise it would not have reached this point)
      const authPayload: AuthPayload = AuthHelper.verifyToken(
        req.headers.authorization!.split(" ")[1],
      );
      if (!req.params.leagueId) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_$MY_LEAGUE_ID),
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
          new ClientError(ClientErrorCode.INVALID_PARAMETER_$MY_LEAGUE_ID),
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
      const serviceRes: IGenericResponse<IMyLeaguesResData | null> =
        await this.myLeaguesService.getMyLeagues$leagueId(
          authPayload.userId,
          parseInt(req.params.leagueId),
          clientErrors,
        );
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
