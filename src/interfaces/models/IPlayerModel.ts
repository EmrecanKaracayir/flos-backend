export interface IPlayerModel {
  readonly playerId: number;
  readonly clubName: string | null;
  readonly fullName: string;
  readonly state: PlayerState;
  readonly age: number;
  readonly goals: number;
  readonly assists: number;
  readonly participantEmail: string;
  readonly biography: string;
  readonly imgPath: string;
}

export enum PlayerState {
  AVAILABLE = "Available",
  IN_A_CLUB = "In a club",
}
