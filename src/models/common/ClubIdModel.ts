import { IClubIdModel } from "../../interfaces/models/common/IClubIdModel";

export class ClubIdModel implements IClubIdModel {
  constructor(public readonly clubId: number) {}

  public static isValidModel(obj: unknown): obj is IClubIdModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IClubIdModel = obj as IClubIdModel;
    return typeof model.clubId === "number";
  }
}
