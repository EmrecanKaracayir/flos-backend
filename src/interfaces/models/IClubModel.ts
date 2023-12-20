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
  NOT_STARTED = "Not ready",
  IN_PROGRESS = "Ready",
  FINISHED = "In a league",
}
