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

  public async postSignupOrganizer(
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
      // Hand over to service
      const serviceRes: IGenericResponse<ISignupOrganizerResData | null> =
        await this.signupService.postSignupOrganizer(
          req.body as ISignupOrganizerReqDto,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new GenericResponse<ISignupOrganizerResData>(
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

  public async postSignupParticipant(
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
      // Hand over to service
      const serviceRes: IGenericResponse<ISignupParticipantResData | null> =
        await this.signupService.postSignupParticipant(
          req.body as ISignupParticipantReqDto,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new GenericResponse<ISignupParticipantResData>(
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
