import { ClubState } from "../../core/enums/clubState";
import { IClubStateModel } from "../../interfaces/models/common/IClubStateModel";

export class ClubStateModel implements IClubStateModel {
  constructor(public readonly state: ClubState) {}

  public static isValidModel(obj: unknown): obj is IClubStateModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IClubStateModel = obj as IClubStateModel;
    return Object.values(ClubState).includes(model.state as ClubState);
  }
}
