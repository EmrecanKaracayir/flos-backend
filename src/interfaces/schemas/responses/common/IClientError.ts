import { LeagueState } from "../../../../core/enums/leagueState";
import { PlayerState } from "../../../../core/enums/playerState";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../../../../core/rules/accountRules";
import {
  CLUB_DESCRIPTION_MAX_LENGTH,
  CLUB_DESCRIPTION_MIN_LENGTH,
  CLUB_NAME_MAX_LENGTH,
  CLUB_NAME_MIN_LENGTH,
} from "../../../../core/rules/clubRules";
import {
  LEAGUE_DESCRIPTION_MAX_LENGTH,
  LEAGUE_DESCRIPTION_MIN_LENGTH,
  LEAGUE_NAME_MAX_LENGTH,
  LEAGUE_NAME_MIN_LENGTH,
} from "../../../../core/rules/leagueRules";
import {
  PLAYER_BIOGRAPHY_MAX_LENGTH,
  PLAYER_BIOGRAPHY_MIN_LENGTH,
  PLAYER_FULL_NAME_MAX_LENGTH,
  PLAYER_FULL_NAME_MIN_LENGTH,
} from "../../../../core/rules/playerRules";
import { QUERY_MIN_LENGTH } from "../../../../core/rules/searchRules";

export interface IClientError {
  readonly code: number;
  readonly message: string;
}

export enum ClientErrorCode {
  // NON-USER RELATED (1XXXX - 5XXXX)
  // - 1XXXX: Contract errors
  INVALID_REQUEST_BODY = 10000,
  MISSING_TOKEN = 10001,
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
  // - - 705XX: /clubs errors
  MISSING_PARAMETER_$CLUB_ID = 70500,
  INVALID_PARAMETER_$CLUB_ID = 70501,
  NO_CLUB_FOUND_IN_CLUBS = 70502,
  // - - 706XX: /players errors
  MISSING_PARAMETER_$PLAYER_ID = 70600,
  INVALID_PARAMETER_$PLAYER_ID = 70601,
  NO_PLAYER_FOUND_IN_PLAYERS = 70602,
  // - - 707XX: /search errors
  MISSING_QUERY_$Q = 70700,
  INVALID_QUERY_$Q = 70701,
  INVALID_QUERY_LENGTH_$Q = 70702,
  // - - 708XX: /my/leagues errors
  MISSING_PARAMETER_$MY_LEAGUE_ID = 70800,
  INVALID_PARAMETER_$MY_LEAGUE_ID = 70801,
  NO_LEAGUE_FOUND_IN_MY_LEAGUES = 70802,
  LEAGUE_CANNOT_BE_EDITED = 70803,
  LEAGUE_CANNOT_BE_DELETED = 70804,
  INVALID_LEAGUE_NAME_LENGTH = 70805,
  INVALID_LEAGUE_PRIZE_VALUE = 70806,
  INVALID_LEAGUE_DESCRIPTION_LENGTH = 70807,
  INVALID_LEAGUE_LOGO_PATH_CONTENT = 70808,
  // - - 709XX: /my/player errors
  PARTICIPANT_HAS_NO_PLAYER = 70900,
  PARTICIPANT_HAS_A_PLAYER = 70901,
  PLAYER_CANNOT_BE_DELETED = 70902,
  INVALID_PLAYER_FULL_NAME_LENGTH = 70903,
  INVALID_DATE_CONTENT = 70904,
  INVALID_BIOGRAPHY_LENGTH = 70905,
  INVALID_PLAYER_IMAGE_PATH_CONTENT = 70906,
  // - - 710XX: /my/club errors
  PARTICIPANT_HAS_NO_CLUB = 71000,
  PARTICIPANT_HAS_A_CLUB = 71001,
  PARTICIPANT_HAS_NO_PLAYER_FOR_CLUB = 71002,
  PARTICIPANT_PLAYER_IS_NOT_AVAILABLE = 71003,
  INVALID_CLUB_NAME_LENGTH = 71004,
  INVALID_DESCRIPTION_LENGTH = 71005,
  INVALID_CLUB_LOGO_PATH_CONTENT = 71006,
  // - - 799XX: /* error
  RESOURCE_NOT_FOUND = 79900,
}

export type ClientErrorMessages = {
  [key in ClientErrorCode]: string;
};

export const clientErrorMessages: ClientErrorMessages = {
  [ClientErrorCode.INVALID_REQUEST_BODY]: "Provided request body was invalid.",
  [ClientErrorCode.MISSING_TOKEN]: "Token was missing.",
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
    "Provided email was not in the valid format. Must be a valid email address.",
  [ClientErrorCode.EMAIL_ALREADY_EXISTS]: "Provided email already exists.",
  [ClientErrorCode.MISSING_PARAMETER_$REFEREE_ID]:
    "Parameter 'refereeId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$REFEREE_ID]:
    "Provided parameter 'refereeId' was invalid.",
  [ClientErrorCode.NO_REFEREE_FOUND_IN_REFEREES]:
    "No referee was found with the provided id.",
  [ClientErrorCode.MISSING_PARAMETER_$VENUE_ID]:
    "Parameter 'venueId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$VENUE_ID]:
    "Provided parameter 'venueId' was invalid.",
  [ClientErrorCode.NO_VENUE_FOUND_IN_VENUES]:
    "No venue was found with the provided id.",
  [ClientErrorCode.MISSING_PARAMETER_$LEAGUE_ID]:
    "Parameter 'leagueId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$LEAGUE_ID]:
    "Provided parameter 'leagueId' was invalid.",
  [ClientErrorCode.NO_LEAGUE_FOUND_IN_LEAGUES]:
    "No league was found with the provided id.",
  [ClientErrorCode.MISSING_PARAMETER_$CLUB_ID]:
    "Parameter 'clubId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$CLUB_ID]:
    "Provided parameter 'clubId' was invalid.",
  [ClientErrorCode.NO_CLUB_FOUND_IN_CLUBS]:
    "No club was found with the provided id.",
  [ClientErrorCode.MISSING_PARAMETER_$PLAYER_ID]:
    "Parameter 'playerId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$PLAYER_ID]:
    "Provided parameter 'playerId' was invalid.",
  [ClientErrorCode.NO_PLAYER_FOUND_IN_PLAYERS]:
    "No player was found with the provided id.",
  [ClientErrorCode.MISSING_QUERY_$Q]: "Query 'q' was missing.",
  [ClientErrorCode.INVALID_QUERY_$Q]: "Provided query 'q' was invalid.",
  [ClientErrorCode.INVALID_QUERY_LENGTH_$Q]: `Provided query 'q' was too short. Search query must be at least ${QUERY_MIN_LENGTH} characters long.`,
  [ClientErrorCode.MISSING_PARAMETER_$MY_LEAGUE_ID]:
    "Parameter 'leagueId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$MY_LEAGUE_ID]:
    "Provided parameter 'leagueId' was invalid.",
  [ClientErrorCode.NO_LEAGUE_FOUND_IN_MY_LEAGUES]:
    "The organizer has no league with the provided id.",
  [ClientErrorCode.LEAGUE_CANNOT_BE_EDITED]: `The league cannot be edited. Its state must be one of '[${LeagueState.NOT_STARTED}]' to be editable.`,
  [ClientErrorCode.LEAGUE_CANNOT_BE_DELETED]: `The league cannot be deleted. Its state must be one of '[${LeagueState.NOT_STARTED}]' to be deletable.`,
  [ClientErrorCode.INVALID_LEAGUE_NAME_LENGTH]: `Provided name wasn't in the length range of ${LEAGUE_NAME_MIN_LENGTH} to ${LEAGUE_NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_LEAGUE_PRIZE_VALUE]:
    "Provided prize value was invalid. Must be a safe positive integer.",
  [ClientErrorCode.INVALID_LEAGUE_DESCRIPTION_LENGTH]: `Provided description wasn't in the length range of ${LEAGUE_DESCRIPTION_MIN_LENGTH} to ${LEAGUE_DESCRIPTION_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_LEAGUE_LOGO_PATH_CONTENT]:
    "Provided logo path was not in the valid format. Must be a valid URL.",
  [ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER]:
    "The participant has no player. A player must be created first.",
  [ClientErrorCode.PARTICIPANT_HAS_A_PLAYER]:
    "The participant already has a player. The player must be deleted first.",
  [ClientErrorCode.PLAYER_CANNOT_BE_DELETED]: `The player cannot be deleted. Its state must be one of '[${PlayerState.AVAILABLE}]' to be deletable.`,
  [ClientErrorCode.INVALID_PLAYER_FULL_NAME_LENGTH]: `Provided full name wasn't in the length range of ${PLAYER_FULL_NAME_MIN_LENGTH} to ${PLAYER_FULL_NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_DATE_CONTENT]:
    "Provided date was not in the valid format. Must be YYYY-MM-DD.",
  [ClientErrorCode.INVALID_BIOGRAPHY_LENGTH]: `Provided biography wasn't in the length range of ${PLAYER_BIOGRAPHY_MIN_LENGTH} to ${PLAYER_BIOGRAPHY_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_PLAYER_IMAGE_PATH_CONTENT]:
    "Provided image path was not in the valid format. Must be a valid URL.",
  [ClientErrorCode.PARTICIPANT_HAS_NO_CLUB]:
    "The participant has no club. A club must be created first.",
  [ClientErrorCode.PARTICIPANT_HAS_A_CLUB]:
    "The participant already has a club. The club must be deleted first.",
  [ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER_FOR_CLUB]:
    "The participant has no player for the club. A player must be created first.",
  [ClientErrorCode.PARTICIPANT_PLAYER_IS_NOT_AVAILABLE]: `The participant's player is not available. The player's state must be one of '[${PlayerState.AVAILABLE}]' to create a club.`,
  [ClientErrorCode.INVALID_CLUB_NAME_LENGTH]: `Provided name wasn't in the length range of ${CLUB_NAME_MIN_LENGTH} to ${CLUB_NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_DESCRIPTION_LENGTH]: `Provided description wasn't in the length range of ${CLUB_DESCRIPTION_MIN_LENGTH} to ${CLUB_DESCRIPTION_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CLUB_LOGO_PATH_CONTENT]:
    "Provided logo path was not in the valid format. Must be a valid URL.",
  [ClientErrorCode.RESOURCE_NOT_FOUND]:
    "The requested resource couldn't be found.",
};
