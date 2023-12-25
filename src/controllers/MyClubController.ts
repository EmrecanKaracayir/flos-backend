import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { IMyClubController } from "../interfaces/controllers/IMyClubController";
import { IMyClubReq } from "../interfaces/schemas/requests/routes/my/club/IMyClubReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { IMyClubRes } from "../interfaces/schemas/responses/routes/my/club/IMyClubRes";
import { IMyClubService } from "../interfaces/services/IMyClubService";
import { MyClubReq } from "../schemas/requests/routes/my/club/MyClubReq";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
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
      const serviceRes: IAppResponse<IMyClubRes | null> =
        await this.myClubService.getMyClub(authPayload.userId, clientErrors);
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res
        .status(serviceRes.httpStatus.code)
        .send(
          new AppResponse<IMyClubRes>(
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
      if (!MyClubReq.isValidReq(req.body)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
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
      const serviceRes: IAppResponse<IMyClubRes | null> =
        await this.myClubService.postMyClub(
          authPayload.userId,
          req.body as IMyClubReq,
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
          new AppResponse<IMyClubRes>(
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

  public async putMyClub(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyClubReq.isValidReq(req.body)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
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
      const serviceRes: IAppResponse<IMyClubRes | null> =
        await this.myClubService.putMyClub(
          authPayload.userId,
          req.body as IMyClubReq,
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
          new AppResponse<IMyClubRes>(
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

  public async deleteMyClub(
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
      const serviceRes: IAppResponse<void> =
        await this.myClubService.deleteMyClub(authPayload.userId, clientErrors);
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res
        .status(serviceRes.httpStatus.code)
        .send(
          new AppResponse<void>(
            serviceRes.httpStatus,
            serviceRes.serverError,
            serviceRes.clientErrors,
            null,
            AuthHelper.generateToken(authPayload),
          ),
        );
    } catch (error) {
      return next(error);
    }
  }
}
