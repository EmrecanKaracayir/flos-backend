import { IClientError } from "../../../interfaces/schemas/responses/common/IClientError";

export class ClientError implements IClientError {
  public readonly code: number;
  public readonly message: string;

  constructor(clientErrorCode: ClientErrorCode) {
    this.code = clientErrorCode;
    this.message = clientErrorMessages[clientErrorCode];
  }
}

export enum ClientErrorCode {
  NO_TOKEN_FOUND = 0x0001,
  INVALID_TOKEN = 0x0002,
  EXPIRED_TOKEN = 0x0003,
  UNCLASSIFIED_TOKEN_ERROR = 0x0004,
  FORBIDDEN_ACCESS = 0x0005,
  INVALID_REQUEST_BODY = 0x0006,
}

type ClientErrorMessage = {
  [key in ClientErrorCode]: string;
};

const clientErrorMessages: ClientErrorMessage = {
  [ClientErrorCode.NO_TOKEN_FOUND]: "Token was not provided.",
  [ClientErrorCode.INVALID_TOKEN]: "Provided token was invalid.",
  [ClientErrorCode.EXPIRED_TOKEN]: "Provided token has expired.",
  [ClientErrorCode.UNCLASSIFIED_TOKEN_ERROR]:
    "Provided token was invalid for an unclassified reason.",
  [ClientErrorCode.FORBIDDEN_ACCESS]:
    "Provided role doesn't have the necessary permissions to access this resource.",
  [ClientErrorCode.INVALID_REQUEST_BODY]: "Provided request body was invalid.",
};
