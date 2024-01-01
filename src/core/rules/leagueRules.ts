import { LeagueState } from "../enums/leagueState";

export const LEAGUE_NAME_MIN_LENGTH: number = 1;
export const LEAGUE_NAME_MAX_LENGTH: number = 60;
export const LEAGUE_DESCRIPTION_MIN_LENGTH: number = 1;
export const LEAGUE_DESCRIPTION_MAX_LENGTH: number = 2048;
export const AVAILABLE_LEAGUE_STATES: LeagueState[] = [LeagueState.NOT_STARTED];
export const EDITABLE_LEAGUE_STATES: LeagueState[] = [LeagueState.NOT_STARTED];
export const DELETABLE_LEAGUE_STATES: LeagueState[] = [LeagueState.NOT_STARTED];
export const STARTABLE_LEAGUE_STATES: LeagueState[] = [LeagueState.NOT_STARTED];
export const SUFFICIENT_CLUBS_COUNT: number = 2;
