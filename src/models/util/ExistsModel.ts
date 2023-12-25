import { IExistsModel } from "../../interfaces/models/util/IExistsModel";

export class ExistsModel implements IExistsModel {
  constructor(public readonly exists: boolean) {}

  public static isValidModel(obj: unknown): obj is IExistsModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IExistsModel = obj as IExistsModel;
    return typeof model.exists === "boolean";
  }
}
