import { Request, Response } from "express";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import {
  HttpStatus,
  HttpStatusCode,
} from "../schemas/responses/common/HttpStatus";
import { ServerError } from "../schemas/responses/common/ServerError";

export class FailureMiddleware {
  public static failure(
    error: Error,
    _req: Request,
    res: Response,
  ): Response | void {
    // Response declaration
    const httpStatus: HttpStatus = new HttpStatus(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
    const clientErrors: Array<ClientError> = [];
    const serverError: ServerError = new ServerError(error);
    // Logic
    console.error(error.stack);
    return res
      .status(httpStatus.code)
      .send(
        new GenericResponse<null>(httpStatus, serverError, clientErrors, null),
      );
  }
}
