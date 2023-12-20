export interface IClubModel {
  readonly clubId: number;
  readonly name: string;
  readonly state: ClubState;
  readonly playerCount: number;
  readonly cupCount: number;
  readonly participantEmail: string;
  readonly description: string;
  readonly logoPath: string;
}

export enum ClubState {
  NOT_READY = "Not ready",
  READY = "Ready",
  IN_A_LEAGUE = "In a league",
}
