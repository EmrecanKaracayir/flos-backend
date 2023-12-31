import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload, UserRole } from "../core/@types/helpers/authPayloadRules";
import { AuthHelper } from "../core/helpers/AuthHelper";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import {
  HttpStatusCode,
  IHttpStatus,
} from "../interfaces/schemas/responses/app/IHttpStatus";
import { UserProvider } from "../providers/common/UserProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";

export class AuthMiddleware {
  public static verifyAuth(allowedUserRoles: Array<UserRole>) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<Response | void> => {
      // Response declaration
      const clientErrors: Array<IClientError> = [];
      // Logic
      const authHeader: string | undefined = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const httpStatus: IHttpStatus = new HttpStatus(
          HttpStatusCode.UNAUTHORIZED,
        );
        clientErrors.push(new ClientError(ClientErrorCode.MISSING_TOKEN));
        return res
          .status(httpStatus.code)
          .send(
            new AppResponse<null>(httpStatus, null, clientErrors, null, null),
          );
      }
      const token: string = authHeader.split(" ")[1];
      try {
        const authPayload: AuthPayload = AuthHelper.verifyToken(token);
        if (!allowedUserRoles.includes(authPayload.userRole)) {
          const httpStatus: IHttpStatus = new HttpStatus(
            HttpStatusCode.FORBIDDEN,
          );
          clientErrors.push(new ClientError(ClientErrorCode.FORBIDDEN_ACCESS));
          return res
            .status(httpStatus.code)
            .send(
              new AppResponse<null>(httpStatus, null, clientErrors, null, null),
            );
        }
        if (
          !(
            await UserProvider.doesUserExist(
              authPayload.userId,
              authPayload.userRole,
            )
          ).exists
        ) {
          const httpStatus: IHttpStatus = new HttpStatus(
            HttpStatusCode.UNAUTHORIZED,
          );
          clientErrors.push(new ClientError(ClientErrorCode.INVALID_TOKEN));
          return res
            .status(httpStatus.code)
            .send(
              new AppResponse<null>(httpStatus, null, clientErrors, null, null),
            );
        }
        return next();
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          if (error instanceof jwt.TokenExpiredError) {
            const httpStatus: IHttpStatus = new HttpStatus(
              HttpStatusCode.UNAUTHORIZED,
            );
            clientErrors.push(new ClientError(ClientErrorCode.EXPIRED_TOKEN));
            return res
              .status(httpStatus.code)
              .send(
                new AppResponse<null>(
                  httpStatus,
                  null,
                  clientErrors,
                  null,
                  null,
                ),
              );
          } else {
            const httpStatus: IHttpStatus = new HttpStatus(
              HttpStatusCode.UNAUTHORIZED,
            );
            clientErrors.push(new ClientError(ClientErrorCode.INVALID_TOKEN));
            return res
              .status(httpStatus.code)
              .send(
                new AppResponse<null>(
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
