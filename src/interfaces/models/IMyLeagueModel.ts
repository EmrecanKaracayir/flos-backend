import { IBaseLeagueModel } from "./base/IBaseLeagueModel";

export interface IMyLeagueModel extends IBaseLeagueModel {
  readonly organizerId: number;
}
