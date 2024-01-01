import { NextFunction, Request, Response } from "express";
import { canParseToInt } from "../core/utils/strings";
import { IRefereesController } from "../interfaces/controllers/IRefereesController";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { IRefereesRes } from "../interfaces/schemas/responses/routes/referees/IRefereesRes";
import { IRefereesService } from "../interfaces/services/IRefereesService";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { RefereesService } from "../services/RefereesService";
import { IReferees$Res } from "../interfaces/schemas/responses/routes/referees/$refereeId/IReferees$Res";

export class RefereesController implements IRefereesController {
  public readonly refereesService: IRefereesService;

  constructor() {
    this.refereesService = new RefereesService();
  }

  public async getReferees(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      // Hand over to service
      const serviceRes: IAppResponse<IRefereesRes[]> =
        await this.refereesService.getReferees(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async getReferees$(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!req.params.refereeId) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_$RFID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      if (!canParseToInt(req.params.refereeId)) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_PARAMETER_$RFID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<IReferees$Res | null> =
        await this.refereesService.getReferees$(
          parseInt(req.params.refereeId),
          clientErrors,
        );
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
