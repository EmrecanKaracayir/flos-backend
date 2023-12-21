import { IClubModel } from "./IClubModel";
import { ILeagueModel } from "./ILeagueModel";
import { IPlayerModel } from "./IPlayerModel";
import { IRefereeModel } from "./IRefereeModel";
import { IVenueModel } from "./IVenueModel";

export interface ISearchModel {
  readonly leagueModels: ILeagueModel[];
  readonly clubModels: IClubModel[];
  readonly playerModels: IPlayerModel[];
  readonly refereeModels: IRefereeModel[];
  readonly venueModels: IVenueModel[];
}
