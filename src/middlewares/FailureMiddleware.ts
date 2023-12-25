import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { AppResponse } from "../schemas/responses/AppResponse";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { ServerError } from "../schemas/responses/app/ServerError";

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
        new AppResponse<null>(
          httpStatus,
          new ServerError(error),
          [],
          null,
          null,
        ),
      );
  }
}
