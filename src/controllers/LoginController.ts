import { NextFunction, Request, Response } from "express";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { ILoginController } from "../interfaces/controllers/ILoginController";
import { ILoginOrganizerReq } from "../interfaces/schemas/requests/routes/login/organizer/ILoginOrganizerReq";
import { ILoginParticipantReq } from "../interfaces/schemas/requests/routes/login/participant/ILoginParticipantReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { ILoginOrganizerRes } from "../interfaces/schemas/responses/routes/login/organizer/ILoginOrganizerRes";
import { ILoginParticipantRes } from "../interfaces/schemas/responses/routes/login/participant/ILoginParticipantRes";
import { ILoginService } from "../interfaces/services/ILoginService";
import { LoginOrganizerReq } from "../schemas/requests/routes/login/organizer/LoginOrganizerReq";
import { LoginParticipantReq } from "../schemas/requests/routes/login/participant/LoginParticipantReq";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { LoginService } from "../services/LoginService";

export class LoginController implements ILoginController {
  public readonly loginService: ILoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  public async postLoginOrganizer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!LoginOrganizerReq.isValidReq(req.body)) {
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
      const serviceRes: IAppResponse<ILoginOrganizerRes | null> =
        await this.loginService.postLoginOrganizer(
          req.body as ILoginOrganizerReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<ILoginOrganizerRes>(
          serviceRes.httpStatus,
          serviceRes.serverError,
          serviceRes.clientErrors,
          serviceRes.data,
          AuthHelper.generateToken({
            userId: serviceRes.data!.organizerId,
            userRole: serviceRes.data!.role,
          }),
        ),
      );
    } catch (error) {
      return next(error);
    }
  }

  public async postLoginParticipant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!LoginParticipantReq.isValidReq(req.body)) {
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
      const serviceRes: IAppResponse<ILoginParticipantRes | null> =
        await this.loginService.postLoginParticipant(
          req.body as ILoginParticipantReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<ILoginParticipantRes>(
          serviceRes.httpStatus,
          serviceRes.serverError,
          serviceRes.clientErrors,
          serviceRes.data,
          AuthHelper.generateToken({
            userId: serviceRes.data!.participantId,
            userRole: serviceRes.data!.role,
          }),
        ),
      );
    } catch (error) {
      return next(error);
    }
  }
}
