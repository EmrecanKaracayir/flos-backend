import { ClubState } from "../enums/clubState";

export const CLUB_NAME_MIN_LENGTH: number = 1;
export const CLUB_NAME_MAX_LENGTH: number = 60;
export const CLUB_DESCRIPTION_MIN_LENGTH: number = 1;
export const CLUB_DESCRIPTION_MAX_LENGTH: number = 2048;
export const AVAILABLE_CLUB_STATES: ClubState[] = [ClubState.READY];
export const DELETABLE_CLUB_STATES: ClubState[] = [
  ClubState.NOT_READY,
  ClubState.READY,
  ClubState.SIGNED,
];
