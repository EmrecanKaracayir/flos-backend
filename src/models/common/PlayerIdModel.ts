import { IPlayerIdModel } from "../../interfaces/models/common/IPlayerIdModel";

export class PlayerIdModel implements IPlayerIdModel {
  constructor(public readonly playerId: number) {}

  public static isValidModel(obj: unknown): obj is IPlayerIdModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IPlayerIdModel = obj as IPlayerIdModel;
    return typeof model.playerId === "number";
  }
}
