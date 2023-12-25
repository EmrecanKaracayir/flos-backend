import { RefereeLicenseType } from "../../../core/enums/refereeLicenseType";
import { IBaseRefereeModel } from "../../../interfaces/models/base/IBaseRefereeModel";
import { IBaseRefereeRes } from "../../../interfaces/schemas/responses/base/IBaseRefereeRes";

export class BaseRefereeRes implements IBaseRefereeRes {
  constructor(
    public readonly refereeId: number,
    public readonly fullName: string,
    public readonly age: number,
    public readonly licenseType: RefereeLicenseType,
    public readonly email: string,
    public readonly imgPath: string,
  ) {}

  public static fromModel(model: IBaseRefereeModel): IBaseRefereeRes {
    return new BaseRefereeRes(
      model.refereeId,
      model.fullName,
      model.age,
      model.licenseType,
      model.email,
      model.imgPath,
    );
  }

  public static fromModels(models: IBaseRefereeModel[]): IBaseRefereeRes[] {
    return models.map(
      (model): IBaseRefereeRes => BaseRefereeRes.fromModel(model),
    );
  }
}
