import { IBaseClubModel } from "./base/IBaseClubModel";

export interface IMyLeagueClubModel extends IBaseClubModel {
  readonly leagueId: number;
}
