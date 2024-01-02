import { IBaseLeagueRes } from "../../../../base/IBaseLeagueRes";
import { IClubsRes } from "../../../clubs/IClubsRes";

export interface IMyLeagues$Res extends IBaseLeagueRes {
  readonly clubs: IClubsRes[];
}
