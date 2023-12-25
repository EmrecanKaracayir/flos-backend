import { RefereeLicenseType } from "../../core/enums/refereeLicenseType";
import { IBaseRefereeModel } from "../../interfaces/models/base/IBaseRefereeModel";

export class BaseRefereeModel implements IBaseRefereeModel {
  constructor(
    public readonly refereeId: number,
    public readonly fullName: string,
    public readonly age: number,
    public readonly licenseType: RefereeLicenseType,
    public readonly email: string,
    public readonly imgPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IBaseRefereeModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseRefereeModel = obj as IBaseRefereeModel;
    return (
      typeof model.refereeId === "number" &&
      typeof model.fullName === "string" &&
      typeof model.age === "number" &&
      Object.values(RefereeLicenseType).includes(
        model.licenseType as RefereeLicenseType,
      ) &&
      typeof model.email === "string" &&
      typeof model.imgPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IBaseRefereeModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseRefereeModel.isValidModel(obj));
  }
}
