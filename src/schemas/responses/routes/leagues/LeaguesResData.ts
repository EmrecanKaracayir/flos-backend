import {
  ILeagueModel,
  LeagueState,
} from "../../../../interfaces/models/ILeagueModel";
import { ILeaguesResData } from "../../../../interfaces/schemas/responses/routes/leagues/ILeaguesResData";

export class LeaguesResData implements ILeaguesResData {
  constructor(
    public readonly leagueId: number,
    public readonly name: string,
    public readonly state: LeagueState,
    public readonly prize: number,
    public readonly email: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static fromModel(model: ILeagueModel): ILeaguesResData {
    return new LeaguesResData(
      model.leagueId,
      model.name,
      model.state,
      model.prize,
      model.organizerEmail,
      model.description,
      model.logoPath,
    );
  }

  public static fromModels(models: ILeagueModel[]): ILeaguesResData[] {
    return models.map(
      (model): ILeaguesResData => LeaguesResData.fromModel(model),
    );
  }
}
