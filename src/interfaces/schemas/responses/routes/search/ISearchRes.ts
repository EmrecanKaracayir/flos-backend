import { IBaseClubRes } from "../../base/IBaseClubRes";
import { IBaseLeagueRes } from "../../base/IBaseLeagueRes";
import { IBasePlayerRes } from "../../base/IBasePlayerRes";
import { IBaseRefereeRes } from "../../base/IBaseRefereeRes";
import { IBaseVenueRes } from "../../base/IBaseVenueRes";

export interface ISearchRes {
  readonly leagues: IBaseLeagueRes[];
  readonly clubs: IBaseClubRes[];
  readonly players: IBasePlayerRes[];
  readonly referees: IBaseRefereeRes[];
  readonly venues: IBaseVenueRes[];
}
