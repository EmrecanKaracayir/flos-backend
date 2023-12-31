import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../../../../core/rules/accountRules";
import {
  AVAILABLE_CLUB_STATES,
  CLUB_DESCRIPTION_MAX_LENGTH,
  CLUB_DESCRIPTION_MIN_LENGTH,
  CLUB_NAME_MAX_LENGTH,
  CLUB_NAME_MIN_LENGTH,
  DELETABLE_CLUB_STATES,
  EDITABLE_CLUB_STATES,
} from "../../../../core/rules/clubRules";
import {
  DELETABLE_LEAGUE_STATES,
  EDITABLE_LEAGUE_STATES,
  LEAGUE_DESCRIPTION_MAX_LENGTH,
  LEAGUE_DESCRIPTION_MIN_LENGTH,
  LEAGUE_NAME_MAX_LENGTH,
  LEAGUE_NAME_MIN_LENGTH,
  STARTABLE_LEAGUE_STATES,
  SUFFICIENT_CLUBS_COUNT,
} from "../../../../core/rules/leagueRules";
import {
  AVAILABLE_PLAYER_STATES,
  EDITABLE_PLAYER_STATES,
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
  MISSING_PARAMETER_$RFID = 70200,
  INVALID_PARAMETER_$RFID = 70201,
  NO_REFEREE_FOUND_IN_REFEREES = 70202,
  // - - 703XX: /venues errors
  MISSING_PARAMETER_$VNID = 70300,
  INVALID_PARAMETER_$VNID = 70301,
  NO_VENUE_FOUND_IN_VENUES = 70302,
  // - - 704XX: /leagues errors
  MISSING_PARAMETER_$LGID = 70400,
  INVALID_PARAMETER_$LGID = 70401,
  NO_LEAGUE_FOUND_IN_LEAGUES = 70402,
  // - - 705XX: /clubs errors
  MISSING_PARAMETER_$CLID = 70500,
  INVALID_PARAMETER_$CLID = 70501,
  NO_CLUB_FOUND_IN_CLUBS = 70502,
  // - - 706XX: /players errors
  MISSING_PARAMETER_$PLID = 70600,
  INVALID_PARAMETER_$PLID = 70601,
  NO_PLAYER_FOUND_IN_PLAYERS = 70602,
  // - - 707XX: /search errors
  MISSING_QUERY_$Q = 70700,
  INVALID_QUERY_$Q = 70701,
  INVALID_QUERY_LENGTH_$Q = 70702,
  // - - 708XX: /my/leagues errors
  MISSING_PARAMETER_MY_LEAGUES_$LGID = 70800,
  INVALID_PARAMETER_MY_LEAGUES_$LGID = 70801,
  NO_LEAGUE_FOUND_IN_MY_LEAGUES = 70802,
  LEAGUE_CANNOT_BE_EDITED = 70803,
  LEAGUE_CANNOT_BE_DELETED = 70804,
  INVALID_LEAGUE_NAME_LENGTH = 70805,
  INVALID_LEAGUE_PRIZE_VALUE = 70806,
  INVALID_LEAGUE_DESCRIPTION_LENGTH = 70807,
  INVALID_LEAGUE_LOGO_PATH_CONTENT = 70808,
  MISSING_PARAMETER_MY_LEAGUES_$CLID = 70809,
  INVALID_PARAMETER_MY_LEAGUES_$CLID = 70810,
  CLUB_NOT_FOUND_FOR_ADDITION = 70811,
  CLUB_NOT_AVAILABLE_FOR_ADDITION = 70812,
  CLUB_NOT_FOUND_FOR_REMOVAL = 70813,
  LEAGUE_CANNOT_BE_STARTED = 70814,
  INSUFFICIENT_CLUBS_COUNT = 70815,
  // - - 709XX: /my/player errors
  PARTICIPANT_HAS_NO_PLAYER = 70900,
  PARTICIPANT_HAS_A_PLAYER = 70901,
  PLAYER_CANNOT_BE_EDITED = 70902,
  PLAYER_CANNOT_BE_DELETED = 70903,
  INVALID_PLAYER_FULL_NAME_LENGTH = 70904,
  INVALID_PLAYER_BIRTHDAY_CONTENT = 70905,
  INVALID_PLAYER_BIOGRAPHY_LENGTH = 70906,
  INVALID_PLAYER_IMAGE_PATH_CONTENT = 70907,
  PLAYER_CANNOT_RESIGN_AS_CAPTAIN = 70908,
  PLAYER_CANNOT_RESIGN = 70909,
  // - - 710XX: /my/club errors
  PARTICIPANT_HAS_NO_CLUB = 71000,
  PARTICIPANT_HAS_A_CLUB = 71001,
  PARTICIPANT_HAS_NO_PLAYER_FOR_CLUB = 71002,
  PARTICIPANT_PLAYER_IS_NOT_AVAILABLE = 71003,
  CLUB_CANNOT_BE_EDITED = 71004,
  CLUB_CANNOT_BE_DELETED = 71005,
  INVALID_CLUB_NAME_LENGTH = 71006,
  INVALID_CLUB_DESCRIPTION_LENGTH = 71007,
  INVALID_CLUB_LOGO_PATH_CONTENT = 71008,
  MISSING_PARAMETER_MY_CLUB_$PLID = 71009,
  INVALID_PARAMETER_MY_CLUB_$PLID = 71010,
  PLAYER_NOT_FOUND_FOR_ADDITION = 71011,
  PLAYER_NOT_AVAILABLE_FOR_ADDITION = 71012,
  PLAYER_NOT_FOUND_FOR_REMOVAL = 71013,
  CANNOT_REMOVE_CAPTAIN = 71014,
  CLUB_CANNOT_RESIGN = 71015,
  // - - 711XX: /available errors
  // - - 712XX: /fixtures errors
  MISSING_PARAMETER_$FXID = 71200,
  INVALID_PARAMETER_$FXID = 71201,
  NO_FIXTURE_FOUND_IN_FIXTURES = 71202,
  // - - 713XX: /my/fixtures errors
  MISSING_PARAMETER_MY_FIXTURES_$FXID = 71300,
  INVALID_PARAMETER_MY_FIXTURES_$FXID = 71301,
  NO_FIXTURE_FOUND_IN_MY_FIXTURES = 71302,
  FIXTURE_ALREADY_SIMULATED = 71303,
  // - - 799XX: /* error
  RESOURCE_NOT_FOUND = 79900,
}

export type ClientErrorMessages = {
  [key in ClientErrorCode]: string;
};

export const clientErrorMessages: ClientErrorMessages = {
  /// NON-USER RELATED (1XXXX - 5XXXX)
  // - 1XXXX: Contract errors
  [ClientErrorCode.INVALID_REQUEST_BODY]: "Provided request body was invalid.",
  [ClientErrorCode.MISSING_TOKEN]: "Token was missing.",
  //
  // USER RELATED ERRORS (6XXXX - 9XXXX)
  // - 6XXXX: Authorization errors
  [ClientErrorCode.INVALID_TOKEN]: "Provided token was invalid.",
  [ClientErrorCode.EXPIRED_TOKEN]: "Provided token has expired.",
  [ClientErrorCode.FORBIDDEN_ACCESS]:
    "Provided role doesn't have the necessary permissions to access this resource.",
  // - 7XXXX: Request errors
  // - - 700XX: /login errors
  [ClientErrorCode.NO_ACCOUNT_FOUND_IN_ORGANIZERS]:
    "No organizer account was found with the provided username.",
  [ClientErrorCode.NO_ACCOUNT_FOUND_IN_PARTICIPANTS]:
    "No participant account was found with the provided username.",
  [ClientErrorCode.INCORRECT_PASSWORD]: "Provided password was incorrect.",
  // - - 701XX: /signup errors
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
  // - - 702XX: /referees errors
  [ClientErrorCode.MISSING_PARAMETER_$RFID]:
    "Parameter 'refereeId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$RFID]:
    "Provided parameter 'refereeId' was invalid.",
  [ClientErrorCode.NO_REFEREE_FOUND_IN_REFEREES]:
    "No referee was found with the provided id.",
  // - - 703XX: /venues errors
  [ClientErrorCode.MISSING_PARAMETER_$VNID]: "Parameter 'venueId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$VNID]:
    "Provided parameter 'venueId' was invalid.",
  [ClientErrorCode.NO_VENUE_FOUND_IN_VENUES]:
    "No venue was found with the provided id.",
  // - - 704XX: /leagues errors
  [ClientErrorCode.MISSING_PARAMETER_$LGID]:
    "Parameter 'leagueId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$LGID]:
    "Provided parameter 'leagueId' was invalid.",
  [ClientErrorCode.NO_LEAGUE_FOUND_IN_LEAGUES]:
    "No league was found with the provided id.",
  // - - 705XX: /clubs errors
  [ClientErrorCode.MISSING_PARAMETER_$CLID]: "Parameter 'clubId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$CLID]:
    "Provided parameter 'clubId' was invalid.",
  [ClientErrorCode.NO_CLUB_FOUND_IN_CLUBS]:
    "No club was found with the provided id.",
  // - - 706XX: /players errors
  [ClientErrorCode.MISSING_PARAMETER_$PLID]:
    "Parameter 'playerId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$PLID]:
    "Provided parameter 'playerId' was invalid.",
  [ClientErrorCode.NO_PLAYER_FOUND_IN_PLAYERS]:
    "No player was found with the provided id.",
  // - - 707XX: /search errors
  [ClientErrorCode.MISSING_QUERY_$Q]: "Query 'q' was missing.",
  [ClientErrorCode.INVALID_QUERY_$Q]: "Provided query 'q' was invalid.",
  [ClientErrorCode.INVALID_QUERY_LENGTH_$Q]: `Provided query 'q' was too short. Search query must be at least ${QUERY_MIN_LENGTH} characters long.`,
  // - - 708XX: /my/leagues errors
  [ClientErrorCode.MISSING_PARAMETER_MY_LEAGUES_$LGID]:
    "Parameter 'leagueId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_MY_LEAGUES_$LGID]:
    "Provided parameter 'leagueId' was invalid.",
  [ClientErrorCode.NO_LEAGUE_FOUND_IN_MY_LEAGUES]:
    "The organizer has no league with the provided id.",
  [ClientErrorCode.LEAGUE_CANNOT_BE_EDITED]: `The league cannot be edited. Its state must be one of '[${EDITABLE_LEAGUE_STATES}]' to be editable.`,
  [ClientErrorCode.LEAGUE_CANNOT_BE_DELETED]: `The league cannot be deleted. Its state must be one of '[${DELETABLE_LEAGUE_STATES}]' to be deletable.`,
  [ClientErrorCode.INVALID_LEAGUE_NAME_LENGTH]: `Provided name wasn't in the length range of ${LEAGUE_NAME_MIN_LENGTH} to ${LEAGUE_NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_LEAGUE_PRIZE_VALUE]:
    "Provided prize value was invalid. Must be a safe positive integer.",
  [ClientErrorCode.INVALID_LEAGUE_DESCRIPTION_LENGTH]: `Provided description wasn't in the length range of ${LEAGUE_DESCRIPTION_MIN_LENGTH} to ${LEAGUE_DESCRIPTION_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_LEAGUE_LOGO_PATH_CONTENT]:
    "Provided logo path was not in the valid format. Must be a valid URL.",
  [ClientErrorCode.MISSING_PARAMETER_MY_LEAGUES_$CLID]:
    "Parameter 'clubId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_MY_LEAGUES_$CLID]:
    "Provided parameter 'clubId' was invalid.",
  [ClientErrorCode.CLUB_NOT_FOUND_FOR_ADDITION]:
    "No club was found with the provided id.",
  [ClientErrorCode.CLUB_NOT_AVAILABLE_FOR_ADDITION]: `The club is not available for addition. Its state must be one of '[${AVAILABLE_CLUB_STATES}]' to be added.`,
  [ClientErrorCode.CLUB_NOT_FOUND_FOR_REMOVAL]:
    "No club was found with the provided id in league. The club must be in the organizer's league to be removed.",
  [ClientErrorCode.LEAGUE_CANNOT_BE_STARTED]: `The league cannot be started. Its state must be one of '[${STARTABLE_LEAGUE_STATES}]' to be started.`,
  [ClientErrorCode.INSUFFICIENT_CLUBS_COUNT]: `The league cannot be started. It must have at least ${SUFFICIENT_CLUBS_COUNT} clubs.`,
  // - - 709XX: /my/player errors
  [ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER]:
    "The participant has no player. A player must be created first.",
  [ClientErrorCode.PARTICIPANT_HAS_A_PLAYER]:
    "The participant already has a player. The player must be deleted first.",
  [ClientErrorCode.PLAYER_CANNOT_BE_EDITED]: `The player cannot be edited. Its state must be one of '[${EDITABLE_PLAYER_STATES}]' to be editable.`,
  [ClientErrorCode.PLAYER_CANNOT_BE_DELETED]: `The player cannot be deleted. Its state must be one of '[${DELETABLE_LEAGUE_STATES}]' to be deletable.`,
  [ClientErrorCode.INVALID_PLAYER_FULL_NAME_LENGTH]: `Provided full name wasn't in the length range of ${PLAYER_FULL_NAME_MIN_LENGTH} to ${PLAYER_FULL_NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_PLAYER_BIRTHDAY_CONTENT]:
    "Provided date was not in the valid format. Must be YYYY-MM-DD.",
  [ClientErrorCode.INVALID_PLAYER_BIOGRAPHY_LENGTH]: `Provided biography wasn't in the length range of ${PLAYER_BIOGRAPHY_MIN_LENGTH} to ${PLAYER_BIOGRAPHY_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_PLAYER_IMAGE_PATH_CONTENT]:
    "Provided image path was not in the valid format. Must be a valid URL.",
  [ClientErrorCode.PLAYER_CANNOT_RESIGN_AS_CAPTAIN]:
    "The player cannot resign as captain. Delete the club instead.",
  [ClientErrorCode.PLAYER_CANNOT_RESIGN]: `The player cannot resign from the club. Club's state must be one of '[${EDITABLE_CLUB_STATES}]' to allow resigning.`,
  // - - 710XX: /my/club errors
  [ClientErrorCode.PARTICIPANT_HAS_NO_CLUB]:
    "The participant has no club. A club must be created first.",
  [ClientErrorCode.PARTICIPANT_HAS_A_CLUB]:
    "The participant already has a club. The club must be deleted first.",
  [ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER_FOR_CLUB]:
    "The participant has no player for the club. A player must be created first.",
  [ClientErrorCode.PARTICIPANT_PLAYER_IS_NOT_AVAILABLE]: `The participant's player is not available. The player's state must be one of '[${AVAILABLE_PLAYER_STATES}]' to create a club.`,
  [ClientErrorCode.CLUB_CANNOT_BE_EDITED]: `The club cannot be edited. Its state must be one of '[${EDITABLE_CLUB_STATES}]' to be editable.`,
  [ClientErrorCode.CLUB_CANNOT_BE_DELETED]: `The club cannot be deleted. Its state must be one of '[${DELETABLE_CLUB_STATES}]' to be deletable.`,
  [ClientErrorCode.INVALID_CLUB_NAME_LENGTH]: `Provided name wasn't in the length range of ${CLUB_NAME_MIN_LENGTH} to ${CLUB_NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CLUB_DESCRIPTION_LENGTH]: `Provided description wasn't in the length range of ${CLUB_DESCRIPTION_MIN_LENGTH} to ${CLUB_DESCRIPTION_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CLUB_LOGO_PATH_CONTENT]:
    "Provided logo path was not in the valid format. Must be a valid URL.",
  [ClientErrorCode.MISSING_PARAMETER_MY_CLUB_$PLID]:
    "Parameter 'playerId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_MY_CLUB_$PLID]:
    "Provided parameter 'playerId' was invalid.",
  [ClientErrorCode.PLAYER_NOT_FOUND_FOR_ADDITION]:
    "No player was found with the provided id.",
  [ClientErrorCode.PLAYER_NOT_AVAILABLE_FOR_ADDITION]: `The player is not available for addition. Its state must be one of '[${AVAILABLE_PLAYER_STATES}]' to be added.`,
  [ClientErrorCode.PLAYER_NOT_FOUND_FOR_REMOVAL]:
    "No player was found with the provided id in club. The player must be in the participant's club to be removed.",
  [ClientErrorCode.CANNOT_REMOVE_CAPTAIN]:
    "The captain cannot be removed from the club. Delete the club instead.",
  [ClientErrorCode.CLUB_CANNOT_RESIGN]: `The club cannot resign from the league. League's state must be one of '[${EDITABLE_LEAGUE_STATES}]' to allow resigning.`,
  // - - 711XX: /available errors
  // - - 712XX: /fixtures errors
  [ClientErrorCode.MISSING_PARAMETER_$FXID]:
    "Parameter 'fixtureId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_$FXID]:
    "Provided parameter 'fixtureId' was invalid.",
  [ClientErrorCode.NO_FIXTURE_FOUND_IN_FIXTURES]:
    "No fixture was found with the provided id.",
  // - - 713XX: /my/fixtures errors
  [ClientErrorCode.MISSING_PARAMETER_MY_FIXTURES_$FXID]:
    "Parameter 'fixtureId' was missing.",
  [ClientErrorCode.INVALID_PARAMETER_MY_FIXTURES_$FXID]:
    "Provided parameter 'fixtureId' was invalid.",
  [ClientErrorCode.NO_FIXTURE_FOUND_IN_MY_FIXTURES]:
    "The organizer has no fixture with the provided id.",
  [ClientErrorCode.FIXTURE_ALREADY_SIMULATED]:
    "The fixture has already been simulated.",
  // - - 799XX: /* error
  [ClientErrorCode.RESOURCE_NOT_FOUND]:
    "The requested resource couldn't be found.",
};
