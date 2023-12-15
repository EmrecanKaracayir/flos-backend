import { NextFunction, Request, Response } from "express";
import { ClientErrorCode } from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";

export class CatcherMiddleware {
  public static resourceNotFound(
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ): Response | void {
    // Response declaration
    const httpStatus: HttpStatus = new HttpStatus(HttpStatusCode.NOT_FOUND);
    // Logic
    return res
      .status(httpStatus.code)
      .send(
        new GenericResponse<null>(
          httpStatus,
          null,
          [new ClientError(ClientErrorCode.RESOURCE_NOT_FOUND)],
          null,
          null,
        ),
      );
  }
}
