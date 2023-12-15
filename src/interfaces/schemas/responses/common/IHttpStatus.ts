export interface IHttpStatus {
  readonly code: number;
  readonly message: string;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export type HttpStatusMessages = {
  [key in HttpStatusCode]: string;
};

export const httpStatusMessages: HttpStatusMessages = {
  [HttpStatusCode.OK]: "OK",
  [HttpStatusCode.CREATED]: "Created",
  [HttpStatusCode.BAD_REQUEST]: "Bad Request",
  [HttpStatusCode.UNAUTHORIZED]: "Unauthorized",
  [HttpStatusCode.FORBIDDEN]: "Forbidden",
  [HttpStatusCode.NOT_FOUND]: "Not Found",
  [HttpStatusCode.CONFLICT]: "Conflict",
  [HttpStatusCode.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};
