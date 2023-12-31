import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { IMyPlayerController } from "../interfaces/controllers/IMyPlayerController";
import { IMyPlayerReq } from "../interfaces/schemas/requests/routes/my/player/IMyPlayerReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { IMyPlayerRes } from "../interfaces/schemas/responses/routes/my/player/IMyPlayerRes";
import { IMyPlayerService } from "../interfaces/services/IMyPlayerService";
import { MyPlayerReq } from "../schemas/requests/routes/my/player/MyPlayerReq";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
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
      const serviceRes: IAppResponse<IMyPlayerRes | null> =
        await this.myPlayerService.getMyPlayer(
          authPayload.userId,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyPlayerRes>(
          serviceRes.httpStatus,
          serviceRes.serverError,
          serviceRes.clientErrors,
          serviceRes.data,
          AuthHelper.generateToken({
            userId: authPayload.userId,
            userRole: authPayload.userRole,
          }),
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
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyPlayerReq.isValidReq(req.body)) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_REQUEST_BODY),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Parse token (Has to be valid, otherwise it would not have reached this point)
      const authPayload: AuthPayload = AuthHelper.verifyToken(
        req.headers.authorization!.split(" ")[1],
      );
      // Hand over to service
      const serviceRes: IAppResponse<IMyPlayerRes | null> =
        await this.myPlayerService.postMyPlayer(
          authPayload.userId,
          req.body as IMyPlayerReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyPlayerRes>(
          serviceRes.httpStatus,
          serviceRes.serverError,
          serviceRes.clientErrors,
          serviceRes.data,
          AuthHelper.generateToken({
            userId: authPayload.userId,
            userRole: authPayload.userRole,
          }),
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
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyPlayerReq.isValidReq(req.body)) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_REQUEST_BODY),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Parse token (Has to be valid, otherwise it would not have reached this point)
      const authPayload: AuthPayload = AuthHelper.verifyToken(
        req.headers.authorization!.split(" ")[1],
      );
      // Hand over to service
      const serviceRes: IAppResponse<IMyPlayerRes | null> =
        await this.myPlayerService.putMyPlayer(
          authPayload.userId,
          req.body as IMyPlayerReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyPlayerRes>(
          serviceRes.httpStatus,
          serviceRes.serverError,
          serviceRes.clientErrors,
          serviceRes.data,
          AuthHelper.generateToken({
            userId: authPayload.userId,
            userRole: authPayload.userRole,
          }),
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
      const serviceRes: IAppResponse<void | null> =
        await this.myPlayerService.deleteMyPlayer(
          authPayload.userId,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<void>(
          serviceRes.httpStatus,
          serviceRes.serverError,
          serviceRes.clientErrors,
          serviceRes.data,
          AuthHelper.generateToken({
            userId: authPayload.userId,
            userRole: authPayload.userRole,
          }),
        ),
      );
    } catch (error) {
      return next(error);
    }
  }

  public async deleteMyPlayerResign(
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
      const serviceRes: IAppResponse<void | null> =
        await this.myPlayerService.deleteMyPlayerResign(
          authPayload.userId,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<void>(
          serviceRes.httpStatus,
          serviceRes.serverError,
          serviceRes.clientErrors,
          serviceRes.data,
          AuthHelper.generateToken({
            userId: authPayload.userId,
            userRole: authPayload.userRole,
          }),
        ),
      );
    } catch (error) {
      return next(error);
    }
  }
}
