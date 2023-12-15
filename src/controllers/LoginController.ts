import { NextFunction, Request, Response } from "express";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { ILoginController } from "../interfaces/controllers/ILoginController";
import { ILoginOrganizerReqDto } from "../interfaces/schemas/requests/routes/login/organizer/ILoginOrganizerReqDto";
import { ILoginParticipantReqDto } from "../interfaces/schemas/requests/routes/login/participant/ILoginParticipantReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/common/IHttpStatus";
import { ILoginOrganizerResData } from "../interfaces/schemas/responses/routes/login/organizer/ILoginOrganizerResData";
import { ILoginParticipantResData } from "../interfaces/schemas/responses/routes/login/participant/ILoginParticipantResData";
import { ILoginService } from "../interfaces/services/ILoginService";
import { LoginOrganizerReqDto } from "../schemas/requests/routes/login/organizer/LoginOrganizerReqDto";
import { LoginParticipantReqDto } from "../schemas/requests/routes/login/participant/LoginParticipantReqDto";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { LoginService } from "../services/LoginService";

export class LoginController implements ILoginController {
  public readonly loginService: ILoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  public async loginOrganizer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!LoginOrganizerReqDto.isValidDto(req.body)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_REQUEST_BODY),
        );
        return res.send(
          new GenericResponse<null>(httpStatus, null, clientErrors, null, null),
        );
      }
      // Hand over to service
      const serviceRes: IGenericResponse<ILoginOrganizerResData> =
        await this.loginService.loginOrganizer(
          req.body as ILoginOrganizerReqDto,
          clientErrors,
        );
      if (!serviceRes.data) {
        // Respond without token
        return res.send(serviceRes);
      }
      // Generate token
      const token: string = AuthHelper.generateToken({
        userId: serviceRes.data.organizerId,
        userRole: serviceRes.data.role,
      });
      // Respond with token
      return res.send(
        new GenericResponse<ILoginOrganizerResData>(
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

  public async loginParticipant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!LoginParticipantReqDto.isValidDto(req.body)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_REQUEST_BODY),
        );
        return res.send(
          new GenericResponse<null>(httpStatus, null, clientErrors, null, null),
        );
      }
      // Hand over to service
      const serviceRes: IGenericResponse<ILoginParticipantResData> =
        await this.loginService.loginParticipant(
          req.body as ILoginParticipantReqDto,
          clientErrors,
        );
      if (!serviceRes.data) {
        // Respond without token
        return res.send(serviceRes);
      }
      // Generate token
      const token: string = AuthHelper.generateToken({
        userId: serviceRes.data.participantId,
        userRole: serviceRes.data.role,
      });
      // Respond with token
      return res.send(
        new GenericResponse<ILoginParticipantResData>(
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
