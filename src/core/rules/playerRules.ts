import { PlayerState } from "../enums/playerState";

export const PLAYER_FULL_NAME_MIN_LENGTH: number = 1;
export const PLAYER_FULL_NAME_MAX_LENGTH: number = 30;
export const PLAYER_BIOGRAPHY_MIN_LENGTH: number = 1;
export const PLAYER_BIOGRAPHY_MAX_LENGTH: number = 2048;
export const AVAILABLE_PLAYER_STATES: PlayerState[] = [PlayerState.AVAILABLE];
export const EDITABLE_PLAYER_STATES: PlayerState[] = [PlayerState.AVAILABLE];
export const DELETABLE_PLAYER_STATES: PlayerState[] = [PlayerState.AVAILABLE];
