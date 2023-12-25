import { NextFunction, Request, Response } from "express";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { ISignupController } from "../interfaces/controllers/ISignupController";
import { ISignupOrganizerReq } from "../interfaces/schemas/requests/routes/signup/organizer/ISignupOrganizerReq";
import { ISignupParticipantReq } from "../interfaces/schemas/requests/routes/signup/participant/ISignupParticipantReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { ISignupOrganizerRes } from "../interfaces/schemas/responses/routes/signup/organizer/ISignupOrganizerRes";
import { ISignupParticipantRes } from "../interfaces/schemas/responses/routes/signup/participant/ISignupParticipantRes";
import { ISignupService } from "../interfaces/services/ISignupService";
import { SignupOrganizerReq } from "../schemas/requests/routes/signup/organizer/SignupOrganizerReq";
import { SignupParticipantReq } from "../schemas/requests/routes/signup/participant/SignupParticipantReq";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
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
      if (!SignupOrganizerReq.isValidReq(req.body)) {
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
      const serviceRes: IAppResponse<ISignupOrganizerRes | null> =
        await this.signupService.postSignupOrganizer(
          req.body as ISignupOrganizerReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<ISignupOrganizerRes>(
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
      if (!SignupParticipantReq.isValidReq(req.body)) {
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
      const serviceRes: IAppResponse<ISignupParticipantRes | null> =
        await this.signupService.postSignupParticipant(
          req.body as ISignupParticipantReq,
          clientErrors,
        );
      if (!serviceRes.httpStatus.isSuccess()) {
        // Respond without token
        return res.status(serviceRes.httpStatus.code).send(serviceRes);
      }
      // Respond with token
      return res.status(serviceRes.httpStatus.code).send(
        new AppResponse<ISignupParticipantRes>(
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
