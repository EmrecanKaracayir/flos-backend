import { ILeagueIdModel } from "../interfaces/models/ILeagueIdModel";

export class LeagueIdModel implements ILeagueIdModel {
  constructor(public readonly leagueId: number) {}

  public static isValidModel(obj: unknown): obj is ILeagueIdModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: ILeagueIdModel = obj as ILeagueIdModel;
    return typeof model.leagueId === "number";
  }
}
