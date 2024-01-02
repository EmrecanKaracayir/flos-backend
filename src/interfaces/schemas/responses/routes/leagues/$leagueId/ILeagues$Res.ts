import { IBaseLeagueClubRes } from "../../../base/IBaseLeagueClubRes";
import { IBaseLeagueRes } from "../../../base/IBaseLeagueRes";

export interface ILeagues$Res extends IBaseLeagueRes {
  readonly clubs: IBaseLeagueClubRes[];
}
