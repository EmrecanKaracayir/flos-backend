import { ClubState } from "../../../../core/enums/clubState";

export interface IBaseLeagueClubRes {
  readonly clubId: number;
  readonly leagueName: string | null;
  readonly name: string;
  readonly state: ClubState;
  readonly playerCount: number;
  readonly cupCount: number;
  readonly email: string;
  readonly description: string;
  readonly logoPath: string;
  readonly played: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly average: number;
  readonly points: number;
}
