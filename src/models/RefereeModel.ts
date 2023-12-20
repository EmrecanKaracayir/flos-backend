import {
  IRefereeModel,
  RefereeLicenseType,
} from "../interfaces/models/IRefereeModel";

export class RefereeModel implements IRefereeModel {
  constructor(
    public readonly refereeId: number,
    public readonly fullName: string,
    public readonly age: number,
    public readonly licenseType: RefereeLicenseType,
    public readonly email: string,
    public readonly imgPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IRefereeModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IRefereeModel = obj as IRefereeModel;
    return (
      typeof model.refereeId === "number" &&
      typeof model.fullName === "string" &&
      typeof model.age === "number" &&
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
