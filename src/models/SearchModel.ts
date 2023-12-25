import { ISearchModel } from "../interfaces/models/ISearchModel";
import { IBaseClubModel } from "../interfaces/models/base/IBaseClubModel";
import { IBaseLeagueModel } from "../interfaces/models/base/IBaseLeagueModel";
import { IBasePlayerModel } from "../interfaces/models/base/IBasePlayerModel";
import { IBaseRefereeModel } from "../interfaces/models/base/IBaseRefereeModel";
import { IBaseVenueModel } from "../interfaces/models/base/IBaseVenueModel";
import { BaseClubModel } from "./base/BaseClubModel";
import { BaseLeagueModel } from "./base/BaseLeagueModel";
import { BasePlayerModel } from "./base/BasePlayerModel";
import { BaseRefereeModel } from "./base/BaseRefereeModel";
import { BaseVenueModel } from "./base/IBaseVenueModel";

export class SearchModel implements ISearchModel {
  constructor(
    public readonly leagueModels: IBaseLeagueModel[],
    public readonly clubModels: IBaseClubModel[],
    public readonly playerModels: IBasePlayerModel[],
    public readonly refereeModels: IBaseRefereeModel[],
    public readonly venueModels: IBaseVenueModel[],
  ) {}

  public static isValidModel(obj: unknown): obj is ISearchModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: ISearchModel = obj as ISearchModel;
    return (
      Array.isArray(model.leagueModels) &&
      BaseLeagueModel.areValidModels(model.leagueModels) &&
      Array.isArray(model.clubModels) &&
      BaseClubModel.areValidModels(model.clubModels) &&
      Array.isArray(model.playerModels) &&
      BasePlayerModel.areValidModels(model.playerModels) &&
      Array.isArray(model.refereeModels) &&
      BaseRefereeModel.areValidModels(model.refereeModels) &&
      Array.isArray(model.venueModels) &&
      BaseVenueModel.areValidModels(model.venueModels)
    );
  }

  public static areValidModels(objs: unknown[]): objs is ISearchModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => SearchModel.isValidModel(obj));
  }
}
