import { IHttpStatus } from "../../../interfaces/schemas/responses/common/IHttpStatus";

export class HttpStatus implements IHttpStatus {
  public readonly code: number;
  public readonly message: string;

  constructor(httpStatusCode: HttpStatusCode) {
    this.code = httpStatusCode;
    this.message = httpStatusMessages[httpStatusCode];
  }
}

export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

type HttpStatusMessage = {
  [key in HttpStatusCode]: string;
};

const httpStatusMessages: HttpStatusMessage = {
  [HttpStatusCode.BAD_REQUEST]: "Bad Request",
  [HttpStatusCode.UNAUTHORIZED]: "Unauthorized",
  [HttpStatusCode.FORBIDDEN]: "Forbidden",
  [HttpStatusCode.NOT_FOUND]: "Not Found",
  [HttpStatusCode.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};
