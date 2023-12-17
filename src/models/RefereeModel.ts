import {
  IRefereeModel,
  RefereeLicenseType,
} from "../interfaces/models/IRefereeModel";

export class RefereeModel implements IRefereeModel {
  constructor(
    public readonly refereeId: number,
    public readonly fullName: string,
    public readonly birthday: Date,
    public readonly licenseType: RefereeLicenseType,
    public readonly email: string,
    public readonly imgPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IRefereeModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: RefereeModel = obj as IRefereeModel;
    return (
      typeof model.refereeId === "number" &&
      typeof model.fullName === "string" &&
      model.birthday instanceof Date &&
      Object.values(RefereeLicenseType).includes(model.licenseType) &&
      typeof model.email === "string" &&
      typeof model.imgPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IRefereeModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => RefereeModel.isValidModel(obj));
  }
}
