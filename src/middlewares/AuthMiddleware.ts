import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload, UserRole } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
import { ClientErrorCode } from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";

export class AuthMiddleware {
  public static verifyAuth(allowedUserRoles: Array<UserRole>) {
    return (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Response | void => {
      // Response declaration
      let httpStatus: HttpStatus;
      const clientErrors: Array<ClientError> = [];
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
              null,
              clientErrors,
              null,
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
                null,
                clientErrors,
                null,
                null,
              ),
            );
        }
        return next();
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          if (error instanceof jwt.TokenExpiredError) {
            httpStatus = new HttpStatus(HttpStatusCode.UNAUTHORIZED);
            clientErrors.push(new ClientError(ClientErrorCode.EXPIRED_TOKEN));
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
          } else {
            httpStatus = new HttpStatus(HttpStatusCode.UNAUTHORIZED);
            clientErrors.push(new ClientError(ClientErrorCode.INVALID_TOKEN));
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
        } else {
          return next(error);
        }
      }
    };
  }
}
