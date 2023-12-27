import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { canParseToInt } from "../core/utils/strings";
import { IMyLeaguesController } from "../interfaces/controllers/IMyLeaguesController";
import { IMyLeaguesReq } from "../interfaces/schemas/requests/routes/my/leagues/IMyLeaguesReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { IMyLeagues$ClubsRes } from "../interfaces/schemas/responses/routes/my/leagues/$leagueId/clubs/IMyLeagues$ClubsRes";
import { IMyLeaguesRes } from "../interfaces/schemas/responses/routes/my/leagues/IMyLeaguesRes";
import { IMyLeaguesService } from "../interfaces/services/IMyLeaguesService";
import { MyLeaguesReq } from "../schemas/requests/routes/my/leagues/MyLeaguesReq";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { MyLeaguesService } from "../services/MyLeaguesService";
import { MyLeagues$ClubsReq } from "../schemas/requests/routes/my/leagues/$/clubs/MyLeagues$ClubsRes";
import { IMyLeagues$ClubsReq } from "../interfaces/schemas/requests/routes/my/leagues/$/clubs/IMyLeagues$ClubsReq";

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
      const serviceRes: IAppResponse<IMyLeaguesRes[]> =
        await this.myLeaguesService.getMyLeagues(
          authPayload.userId,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyLeaguesRes[]>(
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
      if (!MyLeaguesReq.isValidReq(req.body)) {
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
      const serviceRes: IAppResponse<IMyLeaguesRes | null> =
        await this.myLeaguesService.postMyLeagues(
          authPayload.userId,
          req.body as IMyLeaguesReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyLeaguesRes>(
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

  public async getMyLeagues$(
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<IMyLeaguesRes | null> =
        await this.myLeaguesService.getMyLeagues$(
          authPayload.userId,
          parseInt(req.params.leagueId),
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyLeaguesRes>(
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

  public async putMyLeagues$(
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      if (!MyLeaguesReq.isValidReq(req.body)) {
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
      // Hand over to service
      const serviceRes: IAppResponse<IMyLeaguesRes | null> =
        await this.myLeaguesService.putMyLeagues$(
          authPayload.userId,
          parseInt(req.params.leagueId),
          req.body as IMyLeaguesReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyLeaguesRes>(
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

  public async deleteMyLeagues$(
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<void | null> =
        await this.myLeaguesService.deleteMyLeagues$(
          authPayload.userId,
          parseInt(req.params.leagueId),
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

  public async getMyLeagues$Clubs(
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<IMyLeagues$ClubsRes[]> =
        await this.myLeaguesService.getMyLeagues$Clubs(
          authPayload.userId,
          parseInt(req.params.leagueId),
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyLeagues$ClubsRes[]>(
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

  public async postMyLeagues$Clubs(
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
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
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      if (MyLeagues$ClubsReq!.isValidReq(req.body)) {
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
      // Hand over to service
      const serviceRes: IAppResponse<IMyLeagues$ClubsRes[] | null> =
        await this.myLeaguesService.postMyLeagues$Clubs(
          authPayload.userId,
          parseInt(req.params.leagueId),
          req.body as IMyLeagues$ClubsReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyLeagues$ClubsRes[]>(
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
