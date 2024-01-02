import { IBaseLeagueRes } from "../../../base/IBaseLeagueRes";
import { IClubsRes } from "../../clubs/IClubsRes";

export interface ILeagues$Res extends IBaseLeagueRes {
  readonly clubs: IClubsRes[];
}
