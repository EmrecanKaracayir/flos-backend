import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { ILoginController } from "../interfaces/controllers/ILoginController";
import { LoginOrganizer } from "../schemas/requests/routes/login/organizer/LoginOrganizer";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import {
  ClientError,
  ClientErrorCode,
} from "../schemas/responses/common/ClientError";
import {
  HttpStatus,
  HttpStatusCode,
} from "../schemas/responses/common/HttpStatus";
import { ServerError } from "../schemas/responses/common/ServerError";

export class LoginController implements ILoginController {
  constructor() {}

  public async loginOrganizer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    // Response declaration
    let httpStatus: HttpStatus;
    const clientErrors: Array<ClientError> = [];
    const serverError: ServerError | null = null;
    // Logic
    try {
      if (!LoginOrganizer.isValidDto(req.body)) {
        httpStatus = new HttpStatus(HttpStatusCode.BAD_REQUEST);
        clientErrors.push(
          new ClientError(ClientErrorCode.INVALID_REQUEST_BODY),
        );
        return res.send(
          new GenericResponse<null>(
            httpStatus,
            serverError,
            clientErrors,
            null,
          ),
        );
      }
      const dto: LoginOrganizer = req.body;

      
      let password: string = req.body.password as string;
      const salt: string = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);
      return res.send(password);
    } catch (error) {
      return next(error);
    }
  }

  public async loginParticipant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      return res.send(req.body);
    } catch (error) {
      return next(error);
    }
  }
}
