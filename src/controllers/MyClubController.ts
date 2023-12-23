import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { IMyClubController } from "../interfaces/controllers/IMyClubController";
import { IMyClubReqDto } from "../interfaces/schemas/requests/routes/my/club/IMyClubReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/common/IHttpStatus";
import { IMyClubResData } from "../interfaces/schemas/responses/routes/my/club/IMyClubResData";
import { IMyClubService } from "../interfaces/services/IMyClubService";
import { MyClubReqDto } from "../schemas/requests/routes/my/club/MyClubReqDto";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { MyClubService } from "../services/MyClubService";

export class MyClubController implements IMyClubController {
  public readonly myClubService: IMyClubService;

  constructor() {
    this.myClubService = new MyClubService();
  }

  public async getMyClub(
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
      const serviceRes: IGenericResponse<IMyClubResData | null> =
        await this.myClubService.getMyClub(authPayload.userId, clientErrors);
      return res.status(serviceRes.httpStatus.code).send(serviceRes);
    } catch (error) {
      return next(error);
    }
  }

  public async postMyClub(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyClubReqDto.isValidDto(req.body)) {
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
      const serviceRes: IGenericResponse<IMyClubResData | null> =
        await this.myClubService.postMyClub(
          authPayload.userId,
          req.body as IMyClubReqDto,
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
          new GenericResponse<IMyClubResData>(
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
}
