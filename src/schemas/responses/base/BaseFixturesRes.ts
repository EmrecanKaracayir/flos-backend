import { FixtureState } from "../../../core/enums/fixtureState";
import { IBaseFixtureModel } from "../../../interfaces/models/base/IBaseFixtureModel";
import { IBaseFixturesRes } from "../../../interfaces/schemas/responses/base/IBaseFixturesRes";

export class BaseFixturesRes implements IBaseFixturesRes {
  constructor(
    public readonly fixtureId: number,
    public readonly leagueId: number,
    public readonly leagueName: string,
    public readonly homeClubId: number,
    public readonly awayClubId: number,
    public readonly homeClubName: string,
    public readonly awayClubName: string,
    public readonly homeClubRank: number,
    public readonly awayClubRank: number,
    public readonly homeClubLogoPath: string,
    public readonly awayClubLogoPath: string,
    public readonly homeTeamScore: number | null,
    public readonly awayTeamScore: number | null,
    public readonly week: number,
    public readonly refereeId: number,
    public readonly refereeName: string,
    public readonly venueId: number,
    public readonly venueName: string,
    public readonly state: FixtureState,
  ) {}

  public static fromModel(model: IBaseFixtureModel): IBaseFixturesRes {
    return new BaseFixturesRes(
      model.fixtureId,
      model.leagueId,
      model.leagueName,
      model.homeClubId,
      model.awayClubId,
      model.homeClubName,
      model.awayClubName,
      model.homeClubRank,
      model.awayClubRank,
      model.homeClubLogoPath,
      model.awayClubLogoPath,
      model.homeTeamScore,
      model.awayTeamScore,
      model.week,
      model.refereeId,
      model.refereeName,
      model.venueId,
      model.venueName,
      model.state,
    );
  }

  public static fromModels(models: IBaseFixtureModel[]): IBaseFixturesRes[] {
    return models.map(
      (model): IBaseFixturesRes => BaseFixturesRes.fromModel(model),
    );
  }
}
