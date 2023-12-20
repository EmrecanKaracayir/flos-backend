import { ILeagueModel, LeagueState } from "../interfaces/models/ILeagueModel";

export class LeagueModel implements ILeagueModel {
  constructor(
    public readonly leagueId: number,
    public readonly name: string,
    public readonly state: LeagueState,
    public readonly prize: number,
    public readonly organizerEmail: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is ILeagueModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: ILeagueModel = obj as ILeagueModel;
    return (
      typeof model.leagueId === "number" &&
      typeof model.name === "string" &&
      Object.values(LeagueState).includes(model.state) &&
      typeof model.prize === "number" &&
      typeof model.organizerEmail === "string" &&
      typeof model.description === "string" &&
      typeof model.logoPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is ILeagueModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => LeagueModel.isValidModel(obj));
  }
}
