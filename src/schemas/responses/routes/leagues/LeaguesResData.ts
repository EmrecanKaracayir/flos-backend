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

  public static fromModel(leagueModel: ILeagueModel): ILeaguesResData {
    return new LeaguesResData(
      leagueModel.leagueId,
      leagueModel.name,
      leagueModel.state,
      leagueModel.prize,
      leagueModel.organizerEmail,
      leagueModel.description,
      leagueModel.logoPath,
    );
  }

  public static fromModels(leagueModels: ILeagueModel[]): ILeaguesResData[] {
    return leagueModels.map(
      (leagueModel): ILeaguesResData => LeaguesResData.fromModel(leagueModel),
    );
  }
}
