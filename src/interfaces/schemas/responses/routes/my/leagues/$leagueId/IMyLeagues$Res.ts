import { IBaseLeagueClubRes } from "../../../../base/IBaseLeagueClubRes";
import { IBaseLeagueRes } from "../../../../base/IBaseLeagueRes";

export interface IMyLeagues$Res extends IBaseLeagueRes {
  readonly clubs: IBaseLeagueClubRes[];
}
