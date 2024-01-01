import { NextFunction, Request, Response } from "express";
import { canParseToInt } from "../core/utils/strings";
import { IFixturesController } from "../interfaces/controllers/IFixturesController";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { IFixtures$Res } from "../interfaces/schemas/responses/routes/fixtures/$fixtureId/IFixtures$Res";
import { IFixturesRes } from "../interfaces/schemas/responses/routes/fixtures/IFixturesRes";
import { IFixturesService } from "../interfaces/services/IFixturesService";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { FixturesService } from "../services/FixturesService";

export class FixturesController implements IFixturesController {
  public readonly fixturesService: IFixturesService;

  constructor() {
    this.fixturesService = new FixturesService();
  }

  public async getFixtures(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      // Hand over to service
      const serviceRes: IAppResponse<IFixturesRes[]> =
        await this.fixturesService.getFixtures(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async getFixtures$(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!req.params.fixtureId) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_$FXID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      if (!canParseToInt(req.params.fixtureId)) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_PARAMETER_$FXID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<IFixtures$Res | null> =
        await this.fixturesService.getFixtures$(
          parseInt(req.params.fixtureId),
          clientErrors,
        );
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
