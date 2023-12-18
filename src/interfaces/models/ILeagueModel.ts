export interface ILeagueModel {
  readonly leagueId: number;
  readonly name: string;
  readonly state: LeagueState;
  readonly prize: number;
  readonly organizerEmail: string;
  readonly description: string;
  readonly logoPath: string;
}

export enum LeagueState {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  FINISHED = "Finished",
}
