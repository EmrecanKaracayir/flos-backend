import { FixtureState } from "../../core/enums/fixtureState";
import { IBaseFixtureModel } from "../../interfaces/models/base/IBaseFixtureModel";

export class BaseFixtureModel implements IBaseFixtureModel {
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

  public static isValidModel(obj: unknown): obj is IBaseFixtureModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseFixtureModel = obj as IBaseFixtureModel;
    return (
      typeof model.fixtureId === "number" &&
      typeof model.leagueId === "number" &&
      typeof model.leagueName === "string" &&
      typeof model.homeClubId === "number" &&
      typeof model.awayClubId === "number" &&
      typeof model.homeClubName === "string" &&
      typeof model.awayClubName === "string" &&
      typeof model.homeClubRank === "number" &&
      typeof model.awayClubRank === "number" &&
      typeof model.homeClubLogoPath === "string" &&
      typeof model.awayClubLogoPath === "string" &&
      (typeof model.homeTeamScore === "number" ||
        model.homeTeamScore === null) &&
      (typeof model.awayTeamScore === "number" ||
        model.awayTeamScore === null) &&
      typeof model.week === "number" &&
      typeof model.refereeId === "number" &&
      typeof model.refereeName === "string" &&
      typeof model.venueId === "number" &&
      typeof model.venueName === "string" &&
      Object.values(FixtureState).includes(model.state as FixtureState)
    );
  }

  public static areValidModels(objs: unknown[]): objs is IBaseFixtureModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseFixtureModel.isValidModel(obj));
  }

  public static isValidIdModel(obj: unknown): obj is IBaseFixtureModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseFixtureModel = obj as IBaseFixtureModel;
    return typeof model.fixtureId === "number";
  }

  public static areValidIdModels(objs: unknown[]): objs is IBaseFixtureModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseFixtureModel.isValidIdModel(obj));
  }
}
