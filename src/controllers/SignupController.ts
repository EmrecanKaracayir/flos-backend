import { NextFunction, Request, Response } from "express";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { ISignupController } from "../interfaces/controllers/ISignupController";
import { ISignupOrganizerReqDto } from "../interfaces/schemas/requests/routes/signup/organizer/ISignupOrganizerReqDto";
import { ISignupParticipantReqDto } from "../interfaces/schemas/requests/routes/signup/participant/ISignupParticipantReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/common/IHttpStatus";
import { ISignupOrganizerResData } from "../interfaces/schemas/responses/routes/signup/organizer/ISignupOrganizerResData";
import { ISignupParticipantResData } from "../interfaces/schemas/responses/routes/signup/participant/ISignupParticipantResData";
import { ISignupService } from "../interfaces/services/ISignupService";
import { SignupOrganizerReqDto } from "../schemas/requests/routes/signup/organizer/SignupOrganizerReqDto";
import { SignupParticipantReqDto } from "../schemas/requests/routes/signup/participant/SignupParticipantReqDto";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { SignupService } from "../services/SignupService";
export class SignupController implements ISignupController {
  public readonly signupService: ISignupService;

  constructor() {
    this.signupService = new SignupService();
  }

  public async signupOrganizer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!SignupOrganizerReqDto.isValidDto(req.body)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_REQUEST_BODY),
        );
        return res.send(
          new GenericResponse<null>(httpStatus, null, clientErrors, null, null),
        );
      }
      // Hand over to service
      const serviceRes: IGenericResponse<ISignupOrganizerResData> =
        await this.signupService.signupOrganizer(
          req.body as ISignupOrganizerReqDto,
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
        new GenericResponse<ISignupOrganizerResData>(
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

  public async signupParticipant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: IHttpStatus;
    const clientErrors: Array<IClientError> = [];
    // Logic
    try {
      if (!SignupParticipantReqDto.isValidDto(req.body)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_REQUEST_BODY),
        );
        return res.send(
          new GenericResponse<null>(httpStatus, null, clientErrors, null, null),
        );
      }
      // Hand over to service
      const serviceRes: IGenericResponse<ISignupParticipantResData> =
        await this.signupService.signupParticipant(
          req.body as ISignupParticipantReqDto,
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
        new GenericResponse<ISignupParticipantResData>(
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
