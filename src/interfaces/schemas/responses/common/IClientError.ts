export interface IClientError {
  readonly code: number;
  readonly message: string;
}

export enum ClientErrorCode {
  // APPLICATION ERRORS (1XXX - 5XXX)
  // - 1XXX: Contract errors
  INVALID_REQUEST_BODY = 1000,
  NO_TOKEN_FOUND = 1001,

  // USER ERRORS (6XXX - 9XXX)
  // - 6XXX: Authorization errors
  INVALID_TOKEN = 6000,
  EXPIRED_TOKEN = 6001,
  FORBIDDEN_ACCESS = 6002,
  // - 7XXX: Request errors
  // - - 700X: /login errors
  NO_ACCOUNT_FOUND_IN_ORGANIZERS = 7000,
  NO_ACCOUNT_FOUND_IN_PARTICIPANTS = 7001,
  INCORRECT_PASSWORD = 7002,
  // - - 799X: /{non-existent_path} error
  RESOURCE_NOT_FOUND = 7990,
}

export type ClientErrorMessages = {
  [key in ClientErrorCode]: string;
};

export const clientErrorMessages: ClientErrorMessages = {
  [ClientErrorCode.INVALID_REQUEST_BODY]: "Provided request body was invalid.",
  [ClientErrorCode.NO_TOKEN_FOUND]: "Token was not provided.",
  [ClientErrorCode.INVALID_TOKEN]: "Provided token was invalid.",
  [ClientErrorCode.EXPIRED_TOKEN]: "Provided token has expired.",
  [ClientErrorCode.FORBIDDEN_ACCESS]:
    "Provided role doesn't have the necessary permissions to access this resource.",
  [ClientErrorCode.NO_ACCOUNT_FOUND_IN_ORGANIZERS]:
    "No organizer account was found with the provided username.",
  [ClientErrorCode.NO_ACCOUNT_FOUND_IN_PARTICIPANTS]:
    "No participant account was found with the provided username.",
  [ClientErrorCode.INCORRECT_PASSWORD]: "Provided password was incorrect.",
  [ClientErrorCode.RESOURCE_NOT_FOUND]:
    "The requested resource couldn't be found.",
};
