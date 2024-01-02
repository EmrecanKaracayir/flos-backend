import { IBaseClubModel } from "./base/IBaseClubModel";

export interface IMyLeagueClubModel extends IBaseClubModel {
  readonly leagueId: number;
  readonly played: number;
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly average: number;
  readonly points: number;
}
