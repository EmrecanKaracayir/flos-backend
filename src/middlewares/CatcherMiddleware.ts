import { NextFunction, Request, Response } from "express";
import { ClientErrorCode } from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";

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
        new AppResponse<null>(
          httpStatus,
          null,
          [new ClientError(ClientErrorCode.RESOURCE_NOT_FOUND)],
          null,
          null,
        ),
      );
  }
}
