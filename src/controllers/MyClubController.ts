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
import { MyClubPlayersReq } from "../schemas/requests/routes/my/club/players/MyClubPlayersReq";
import { IMyClubPlayersReq } from "../interfaces/schemas/requests/routes/my/club/players/IMyClubPlayersReq";
import { IMyClubPlayersRes } from "../interfaces/schemas/responses/routes/my/club/players/IMyClubPlayersRes";
import { canParseToInt } from "../core/utils/strings";

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
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyClubRes>(
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

  public async postMyClub(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyClubReq.isValidReq(req.body)) {
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
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyClubRes>(
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

  public async putMyClub(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyClubReq.isValidReq(req.body)) {
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
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyClubRes>(
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
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<void>(
          serviceRes.httpStatus,
          serviceRes.serverError,
          serviceRes.clientErrors,
          null,
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

  public async getMyClubPlayers(
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
      const serviceRes: IAppResponse<IMyClubPlayersRes[] | null> =
        await this.myClubService.getMyClubPlayers(
          authPayload.userId,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyClubPlayersRes[]>(
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

  public async postMyClubPlayers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!MyClubPlayersReq.isValidReq(req.body)) {
        const httpStatus: IHttpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
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
      const serviceRes: IAppResponse<IMyClubPlayersRes | null> =
        await this.myClubService.postMyClubPlayers(
          authPayload.userId,
          req.body as IMyClubPlayersReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyClubPlayersRes>(
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

  public async deleteMyClubPlayers$(
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
      if (!req.params.playerId) {
        const httpStatus: IHttpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_MY_CLUB_$PLID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      if (!canParseToInt(req.params.playerId)) {
        const httpStatus: IHttpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_PARAMETER_MY_CLUB_$PLID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<void> =
        await this.myClubService.deleteMyClubPlayers$(
          authPayload.userId,
          parseInt(req.params.playerId),
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
          null,
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
