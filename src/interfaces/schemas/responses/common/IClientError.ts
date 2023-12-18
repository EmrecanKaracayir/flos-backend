import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../../../../core/rules/accountRules";

export interface IClientError {
  readonly code: number;
  readonly message: string;
}

export enum ClientErrorCode {
  // NON-USER RELATED (1XXXX - 5XXXX)
  // - 1XXXX: Contract errors
  INVALID_REQUEST_BODY = 10000,
  NO_TOKEN_FOUND = 10001,
  //
  // USER RELATED ERRORS (6XXXX - 9XXXX)
  // - 6XXXX: Authorization errors
  INVALID_TOKEN = 60000,
  EXPIRED_TOKEN = 60001,
  FORBIDDEN_ACCESS = 60002,
  // - 7XXXX: Request errors
  // - - 700XX: /login errors
  NO_ACCOUNT_FOUND_IN_ORGANIZERS = 70000,
  NO_ACCOUNT_FOUND_IN_PARTICIPANTS = 70001,
  INCORRECT_PASSWORD = 70002,
  // - - 701XX: /signup errors
  INVALID_USERNAME_LENGTH = 70100,
  INVALID_USERNAME_CONTENT = 70101,
  USERNAME_ALREADY_EXISTS = 70102,
  INVALID_PASSWORD_LENGTH = 70103,
  INVALID_PASSWORD_CONTENT = 70104,
  INVALID_EMAIL_LENGTH = 70105,
  INVALID_EMAIL_CONTENT = 70106,
  EMAIL_ALREADY_EXISTS = 70107,
  // - - 702XX: /referees errors
  MISSING_PARAMETER_$REFEREE_ID = 70200,
  INVALID_PARAMETER_$REFEREE_ID = 70201,
  NO_REFEREE_FOUND_IN_REFEREES = 70202,
  // - - 703XX: /venues errors
  MISSING_PARAMETER_$VENUE_ID = 70300,
  INVALID_PARAMETER_$VENUE_ID = 70301,
  NO_VENUE_FOUND_IN_VENUES = 70302,
  // - - 704XX: /leagues errors
  MISSING_PARAMETER_$LEAGUE_ID = 70400,
  INVALID_PARAMETER_$LEAGUE_ID = 70401,
  NO_LEAGUE_FOUND_IN_LEAGUES = 70402,
  // - - 799XX: /* error
  RESOURCE_NOT_FOUND = 79900,
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
  [ClientErrorCode.INVALID_USERNAME_LENGTH]: `Provided username wasn't in the length range of ${USERNAME_MIN_LENGTH} to ${USERNAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_USERNAME_CONTENT]:
    "Provided username contained forbidden characters.",
  [ClientErrorCode.USERNAME_ALREADY_EXISTS]:
    "Provided username already exists.",
  [ClientErrorCode.INVALID_PASSWORD_LENGTH]: `Provided password was too short. A password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
  [ClientErrorCode.INVALID_PASSWORD_CONTENT]:
    "Provided password didn't satisfy the requirements. A password must contain at least one lowercase letter, one uppercase letter, one digit and one special character.",
  [ClientErrorCode.INVALID_EMAIL_LENGTH]: `Provided email wasn't in the length range of ${EMAIL_MIN_LENGTH} to ${EMAIL_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_EMAIL_CONTENT]:
    "Provided email was not in the valid format.",
  [ClientErrorCode.EMAIL_ALREADY_EXISTS]: "Provided email already exists.",
  [ClientErrorCode.MISSING_PARAMETER_$REFEREE_ID]:
    "Parameter 'refereeId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$REFEREE_ID]:
    "Parameter 'refereeId' was invalid.",
  [ClientErrorCode.NO_REFEREE_FOUND_IN_REFEREES]:
    "No referee was found with the provided id.",
  [ClientErrorCode.MISSING_PARAMETER_$VENUE_ID]:
    "Parameter 'venueId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$VENUE_ID]:
    "Parameter 'venueId' was invalid.",
  [ClientErrorCode.NO_VENUE_FOUND_IN_VENUES]:
    "No venue was found with the provided id.",
  [ClientErrorCode.MISSING_PARAMETER_$LEAGUE_ID]:
    "Parameter 'leagueId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$LEAGUE_ID]:
    "Parameter 'leagueId' was invalid.",
  [ClientErrorCode.NO_LEAGUE_FOUND_IN_LEAGUES]:
    "No league was found with the provided id.",
  [ClientErrorCode.RESOURCE_NOT_FOUND]:
    "The requested resource couldn't be found.",
};
