import { IRecordExistsModel } from "../interfaces/models/IRecordExistsModel";

export class RecordExistsModel implements IRecordExistsModel {
  constructor(public readonly recordExists: boolean) {}

  public static isValidModel(obj: unknown): obj is IRecordExistsModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IRecordExistsModel = obj as IRecordExistsModel;
    return typeof model.recordExists === "boolean";
  }
}
