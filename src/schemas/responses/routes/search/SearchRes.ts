import { ISearchModel } from "../../../../interfaces/models/ISearchModel";
import { IBaseClubRes } from "../../../../interfaces/schemas/responses/base/IBaseClubRes";
import { IBaseLeagueRes } from "../../../../interfaces/schemas/responses/base/IBaseLeagueRes";
import { IBasePlayerRes } from "../../../../interfaces/schemas/responses/base/IBasePlayerRes";
import { IBaseRefereeRes } from "../../../../interfaces/schemas/responses/base/IBaseRefereeRes";
import { IBaseVenueRes } from "../../../../interfaces/schemas/responses/base/IBaseVenueRes";
import { ISearchRes } from "../../../../interfaces/schemas/responses/routes/search/ISearchRes";
import { BaseClubRes } from "../../base/BaseClubRes";
import { BaseLeagueRes } from "../../base/BaseLeagueRes";
import { BasePlayerRes } from "../../base/BasePlayerRes";
import { BaseRefereeRes } from "../../base/BaseRefereeRes";
import { BaseVenueRes } from "../../base/BaseVenueRes";

export class SearchRes implements ISearchRes {
  constructor(
    public readonly leagues: IBaseLeagueRes[],
    public readonly clubs: IBaseClubRes[],
    public readonly players: IBasePlayerRes[],
    public readonly referees: IBaseRefereeRes[],
    public readonly venues: IBaseVenueRes[],
  ) {}

  public static fromModel(model: ISearchModel): ISearchRes {
    return new SearchRes(
      BaseLeagueRes.fromModels(model.leagueModels),
      BaseClubRes.fromModels(model.clubModels),
      BasePlayerRes.fromModels(model.playerModels),
      BaseRefereeRes.fromModels(model.refereeModels),
      BaseVenueRes.fromModels(model.venueModels),
    );
  }

  public static fromModels(models: ISearchModel[]): ISearchRes[] {
    return models.map((model): ISearchRes => SearchRes.fromModel(model));
  }
}
