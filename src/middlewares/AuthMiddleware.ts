import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload, UserRole } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
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

export class AuthMiddleware {
  public static authenticate(allowedUserRoles: Array<UserRole>) {
    return (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Response | void => {
      // Response declaration
      let httpStatus: HttpStatus;
      const clientErrors: Array<ClientError> = [];
      const serverError: ServerError | null = null;
      // Logic
      const authHeader: string | undefined = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        httpStatus = new HttpStatus(HttpStatusCode.UNAUTHORIZED);
        clientErrors.push(new ClientError(ClientErrorCode.NO_TOKEN_FOUND));
        return res
          .status(httpStatus.code)
          .send(
            new GenericResponse<null>(
              httpStatus,
              serverError,
              clientErrors,
              null,
            ),
          );
      }
      const token: string = authHeader.split(" ")[1];
      try {
        const authPayload: AuthPayload = AuthHelper.verifyToken(token);
        if (!allowedUserRoles.includes(authPayload.userRole)) {
          httpStatus = new HttpStatus(HttpStatusCode.FORBIDDEN);
          clientErrors.push(new ClientError(ClientErrorCode.FORBIDDEN_ACCESS));
          return res
            .status(httpStatus.code)
            .send(
              new GenericResponse<null>(
                httpStatus,
                serverError,
                clientErrors,
                null,
              ),
            );
        }
        return next();
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          httpStatus = new HttpStatus(HttpStatusCode.UNAUTHORIZED);
          clientErrors.push(new ClientError(ClientErrorCode.INVALID_TOKEN));
          return res
            .status(httpStatus.code)
            .send(
              new GenericResponse<null>(
                httpStatus,
                serverError,
                clientErrors,
                null,
              ),
            );
        } else if (error instanceof jwt.TokenExpiredError) {
          httpStatus = new HttpStatus(HttpStatusCode.UNAUTHORIZED);
          clientErrors.push(new ClientError(ClientErrorCode.EXPIRED_TOKEN));
          return res
            .status(httpStatus.code)
            .send(
              new GenericResponse<null>(
                httpStatus,
                serverError,
                clientErrors,
                null,
              ),
            );
        } else {
          httpStatus = new HttpStatus(HttpStatusCode.UNAUTHORIZED);
          clientErrors.push(
            new ClientError(ClientErrorCode.UNCLASSIFIED_TOKEN_ERROR),
          );
          return res
            .status(httpStatus.code)
            .send(
              new GenericResponse<null>(
                httpStatus,
                serverError,
                clientErrors,
                null,
              ),
            );
        }
      }
    };
  }
}
