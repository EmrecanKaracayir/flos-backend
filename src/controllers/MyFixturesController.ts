import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { canParseToInt } from "../core/utils/strings";
import { IMyFixturesController } from "../interfaces/controllers/IMyFixturesController";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { IMyFixtures$Res } from "../interfaces/schemas/responses/routes/my/fixtures/$fixtureId/IFixtures$Res";
import { IMyFixturesRes } from "../interfaces/schemas/responses/routes/my/fixtures/IFixturesRes";
import { IMyFixturesService } from "../interfaces/services/IMyFixturesService";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { MyFixturesService } from "../services/MyFixturesService";

export class MyFixturesController implements IMyFixturesController {
  public readonly myFixturesService: IMyFixturesService;

  constructor() {
    this.myFixturesService = new MyFixturesService();
  }

  public async getMyFixtures(
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
      const serviceRes: IAppResponse<IMyFixturesRes[]> =
        await this.myFixturesService.getMyFixtures(
          authPayload.userId,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyFixturesRes[]>(
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
  public async getMyFixtures$(
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
      if (!req.params.fixtureId) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_MY_FIXTURES_$FXID),
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
          new ClientError(ClientErrorCode.INVALID_PARAMETER_MY_FIXTURES_$FXID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<IMyFixtures$Res | null> =
        await this.myFixturesService.getMyFixtures$(
          authPayload.userId,
          parseInt(req.params.fixtureId),
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyFixtures$Res>(
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

  public async putMyFixtures$Simulate(
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
      if (!req.params.fixtureId) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.BAD_REQUEST,
        );
        clientErrors.push(
          new ClientError(ClientErrorCode.MISSING_PARAMETER_MY_FIXTURES_$FXID),
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
          new ClientError(ClientErrorCode.INVALID_PARAMETER_MY_FIXTURES_$FXID),
        );
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      // Hand over to service
      const serviceRes: IAppResponse<IMyFixtures$Res | null> =
        await this.myFixturesService.putMyFixtures$Simulate(
          authPayload.userId,
          parseInt(req.params.fixtureId),
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<IMyFixtures$Res>(
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
