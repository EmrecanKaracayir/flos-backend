import { IClubModel } from "../interfaces/models/IClubModel";
import { ILeagueModel } from "../interfaces/models/ILeagueModel";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import { IRefereeModel } from "../interfaces/models/IRefereeModel";
import { ISearchModel } from "../interfaces/models/ISearchModel";
import { IVenueModel } from "../interfaces/models/IVenueModel";
import { ClubModel } from "./ClubModel";
import { LeagueModel } from "./LeagueModel";
import { PlayerModel } from "./PlayerModel";
import { RefereeModel } from "./RefereeModel";
import { VenueModel } from "./VenueModel";

export class SearchModel implements ISearchModel {
  constructor(
    public readonly leagueModels: ILeagueModel[],
    public readonly clubModels: IClubModel[],
    public readonly playerModels: IPlayerModel[],
    public readonly refereeModels: IRefereeModel[],
    public readonly venueModels: IVenueModel[],
  ) {}

  public static isValidModel(obj: unknown): obj is ISearchModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: ISearchModel = obj as ISearchModel;
    return (
      Array.isArray(model.leagueModels) &&
      LeagueModel.areValidModels(model.leagueModels) &&
      Array.isArray(model.clubModels) &&
      ClubModel.areValidModels(model.clubModels) &&
      Array.isArray(model.playerModels) &&
      PlayerModel.areValidModels(model.playerModels) &&
      Array.isArray(model.refereeModels) &&
      RefereeModel.areValidModels(model.refereeModels) &&
      Array.isArray(model.venueModels) &&
      VenueModel.areValidModels(model.venueModels)
    );
  }
}
