import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { IMyPlayerController } from "../interfaces/controllers/IMyPlayerController";
import { IMyPlayerReqDto } from "../interfaces/schemas/requests/routes/my/player/IMyPlayerReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/common/IHttpStatus";
import { IMyPlayerResData } from "../interfaces/schemas/responses/routes/my/player/IMyPlayerResData";
import { IMyPlayerService } from "../interfaces/services/IMyPlayerService";
import { MyPlayerReqDto } from "../schemas/requests/routes/my/player/MyLeaguesReqDto";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { MyPlayerService } from "../services/MyPlayerService";

export class MyPlayerController implements IMyPlayerController {
  public readonly myPlayerService: IMyPlayerService;

  constructor() {
    this.myPlayerService = new MyPlayerService();
  }

  public async getMyPlayer(
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
      const serviceRes: IGenericResponse<IMyPlayerResData | null> =
        await this.myPlayerService.getMyPlayer(
          authPayload.userId,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res
        .status(serviceRes.httpStatus.code)
        .send(
          new GenericResponse<IMyPlayerResData>(
            serviceRes.httpStatus,
            serviceRes.serverError,
            serviceRes.clientErrors,
            serviceRes.data,
            AuthHelper.generateToken(authPayload),
          ),
        );
    } catch (error) {
      return next(error);
    }
  }

  public async postMyPlayer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyPlayerReqDto.isValidDto(req.body)) {
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
      const serviceRes: IGenericResponse<IMyPlayerResData | null> =
        await this.myPlayerService.postMyPlayer(
          authPayload.userId,
          req.body as IMyPlayerReqDto,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res
        .status(serviceRes.httpStatus.code)
        .send(
          new GenericResponse<IMyPlayerResData>(
            serviceRes.httpStatus,
            serviceRes.serverError,
            serviceRes.clientErrors,
            serviceRes.data,
            AuthHelper.generateToken(authPayload),
          ),
        );
    } catch (error) {
      return next(error);
    }
  }

  public async putMyPlayer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyPlayerReqDto.isValidDto(req.body)) {
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
      const serviceRes: IGenericResponse<IMyPlayerResData | null> =
        await this.myPlayerService.putMyPlayer(
          authPayload.userId,
          req.body as IMyPlayerReqDto,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res
        .status(serviceRes.httpStatus.code)
        .send(
          new GenericResponse<IMyPlayerResData>(
            serviceRes.httpStatus,
            serviceRes.serverError,
            serviceRes.clientErrors,
            serviceRes.data,
            AuthHelper.generateToken(authPayload),
          ),
        );
    } catch (error) {
      return next(error);
    }
  }

  public async deleteMyPlayer(
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
      const serviceRes: IGenericResponse<void | null> =
        await this.myPlayerService.deleteMyPlayer(
          authPayload.userId,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res
        .status(serviceRes.httpStatus.code)
        .send(
          new GenericResponse<void>(
            serviceRes.httpStatus,
            serviceRes.serverError,
            serviceRes.clientErrors,
            serviceRes.data,
            AuthHelper.generateToken(authPayload),
          ),
        );
    } catch (error) {
      return next(error);
    }
  }
}
