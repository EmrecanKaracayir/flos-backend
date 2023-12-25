import { LeagueState } from "../../core/enums/leagueState";
import { IBaseLeagueModel } from "../../interfaces/models/base/IBaseLeagueModel";

export class BaseLeagueModel implements IBaseLeagueModel {
  constructor(
    public readonly leagueId: number,
    public readonly name: string,
    public readonly state: LeagueState,
    public readonly prize: number,
    public readonly organizerEmail: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IBaseLeagueModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseLeagueModel = obj as IBaseLeagueModel;
    return (
      typeof model.leagueId === "number" &&
      typeof model.name === "string" &&
      Object.values(LeagueState).includes(model.state as LeagueState) &&
      typeof model.prize === "number" &&
      typeof model.organizerEmail === "string" &&
      typeof model.description === "string" &&
      typeof model.logoPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IBaseLeagueModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseLeagueModel.isValidModel(obj));
  }

  public static isValidIdModel(obj: unknown): obj is IBaseLeagueModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseLeagueModel = obj as IBaseLeagueModel;
    return typeof model.leagueId === "number";
  }

  public static areValidIdModels(objs: unknown[]): objs is IBaseLeagueModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseLeagueModel.isValidIdModel(obj));
  }
}
