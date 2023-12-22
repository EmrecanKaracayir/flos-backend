import { NextFunction, Request, Response } from "express";
import { canParseToInt } from "../core/utils/strings";
import { IClubsController } from "../interfaces/controllers/IClubsController";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/common/IHttpStatus";
import { IClubsResData } from "../interfaces/schemas/responses/routes/clubs/IClubsResData";
import { IClubsService } from "../interfaces/services/IClubsService";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { ClubsService } from "../services/ClubsService";

export class ClubsController implements IClubsController {
  public readonly clubsService: IClubsService;

  constructor() {
    this.clubsService = new ClubsService();
  }

  public async getClubs(
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
        await this.clubsService.getClubs(clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async getClubs$clubId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!req.params.clubId) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_$CLUB_ID),
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
      if (!canParseToInt(req.params.clubId)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_PARAMETER_$CLUB_ID),
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
      const serviceRes: IGenericResponse<IClubsResData | null> =
        await this.clubsService.getClubs$clubId(
          parseInt(req.params.clubId),
          clientErrors,
        );
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }
}
