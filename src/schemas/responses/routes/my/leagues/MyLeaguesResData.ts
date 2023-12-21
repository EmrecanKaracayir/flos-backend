import { LeagueState } from "../../../../../core/enums/leagueState";
import { IMyLeagueModel } from "../../../../../interfaces/models/IMyLeagueModel";
import { IMyLeaguesResData } from "../../../../../interfaces/schemas/responses/routes/my/leagues/IMyLeaguesResData";

export class MyLeaguesResData implements IMyLeaguesResData {
  constructor(
    public readonly leagueId: number,
    public readonly name: string,
    public readonly state: LeagueState,
    public readonly prize: number,
    public readonly email: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static fromModel(model: IMyLeagueModel): IMyLeaguesResData {
    return new MyLeaguesResData(
      model.leagueId,
      model.name,
      model.state,
      model.prize,
      model.organizerEmail,
      model.description,
      model.logoPath,
    );
  }

  public static fromModels(models: IMyLeagueModel[]): IMyLeaguesResData[] {
    return models.map(
      (model): IMyLeaguesResData => MyLeaguesResData.fromModel(model),
    );
  }
}
