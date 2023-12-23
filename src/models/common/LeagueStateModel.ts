import { LeagueState } from "../../core/enums/leagueState";
import { ILeagueStateModel } from "../../interfaces/models/common/ILeagueStateModel";

export class LeagueStateModel implements ILeagueStateModel {
  constructor(public readonly state: LeagueState) {}

  public static isValidModel(obj: unknown): obj is ILeagueStateModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: ILeagueStateModel = obj as ILeagueStateModel;
    return Object.values(LeagueState).includes(model.state as LeagueState);
  }
}
