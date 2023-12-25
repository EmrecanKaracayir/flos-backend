import { NextFunction, Request, Response } from "express";
import { canParseToInt } from "../core/utils/strings";
import { IVenuesController } from "../interfaces/controllers/IVenuesController";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { IVenuesRes } from "../interfaces/schemas/responses/routes/venues/IVenuesRes";
import { IVenuesService } from "../interfaces/services/IVenuesService";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { VenuesService } from "../services/VenuesService";

export class VenuesController implements IVenuesController {
  public readonly venuesService: IVenuesService;

  constructor() {
    this.venuesService = new VenuesService();
  }

  public async getVenues(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      // Hand over to service
      const serviceRes: IAppResponse<IVenuesRes[]> =
        await this.venuesService.getVenues(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async getVenues$(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!req.params.venueId) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_$VENUE_ID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      if (!canParseToInt(req.params.venueId)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_PARAMETER_$VENUE_ID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<IVenuesRes | null> =
        await this.venuesService.getVenues$(
          parseInt(req.params.venueId),
          clientErrors,
        );
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
