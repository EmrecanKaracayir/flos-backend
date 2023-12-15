import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { ServerError } from "../schemas/responses/common/ServerError";

export class FailureMiddleware {
  public static serverFailure(
    error: Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ): Response | void {
    // Response declaration
    const httpStatus: HttpStatus = new HttpStatus(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
    // Logic
    console.error(error.stack);
    return res
      .status(httpStatus.code)
      .send(
        new GenericResponse<null>(
          httpStatus,
          new ServerError(error),
          [],
          null,
          null,
        ),
      );
  }
}
