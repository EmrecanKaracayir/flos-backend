import { LeagueState } from "../core/enums/leagueState";
import { IMyLeagueModel } from "../interfaces/models/IMyLeagueModel";

export class MyLeagueModel implements IMyLeagueModel {
  constructor(
    public readonly leagueId: number,
    public readonly organizerId: number,
    public readonly name: string,
    public readonly state: LeagueState,
    public readonly prize: number,
    public readonly organizerEmail: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IMyLeagueModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IMyLeagueModel = obj as IMyLeagueModel;
    return (
      typeof model.leagueId === "number" &&
      typeof model.organizerId === "number" &&
      typeof model.name === "string" &&
      Object.values(LeagueState).includes(model.state as LeagueState) &&
      typeof model.prize === "number" &&
      typeof model.organizerEmail === "string" &&
      typeof model.description === "string" &&
      typeof model.logoPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IMyLeagueModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => MyLeagueModel.isValidModel(obj));
  }
}
