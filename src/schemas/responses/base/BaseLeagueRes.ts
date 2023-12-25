import { LeagueState } from "../../../core/enums/leagueState";
import { IBaseLeagueModel } from "../../../interfaces/models/base/IBaseLeagueModel";
import { IBaseLeagueRes } from "../../../interfaces/schemas/responses/base/IBaseLeagueRes";

export class BaseLeagueRes implements IBaseLeagueRes {
  constructor(
    public readonly leagueId: number,
    public readonly name: string,
    public readonly state: LeagueState,
    public readonly prize: number,
    public readonly email: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static fromModel(model: IBaseLeagueModel): IBaseLeagueRes {
    return new BaseLeagueRes(
      model.leagueId,
      model.name,
      model.state,
      model.prize,
      model.organizerEmail,
      model.description,
      model.logoPath,
    );
  }

  public static fromModels(models: IBaseLeagueModel[]): IBaseLeagueRes[] {
    return models.map(
      (model): IBaseLeagueRes => BaseLeagueRes.fromModel(model),
    );
  }
}
