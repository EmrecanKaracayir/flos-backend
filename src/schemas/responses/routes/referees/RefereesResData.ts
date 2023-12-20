import {
  IRefereeModel,
  RefereeLicenseType,
} from "../../../../interfaces/models/IRefereeModel";
import { IRefereesResData } from "../../../../interfaces/schemas/responses/routes/referees/IRefereesResData";

export class RefereesResData implements IRefereesResData {
  constructor(
    public readonly refereeId: number,
    public readonly fullName: string,
    public readonly age: number,
    public readonly licenseType: RefereeLicenseType,
    public readonly email: string,
    public readonly imgPath: string,
  ) {}

  public static fromModel(model: IRefereeModel): IRefereesResData {
    return new RefereesResData(
      model.refereeId,
      model.fullName,
      model.age,
      model.licenseType,
      model.email,
      model.imgPath,
    );
  }

  public static fromModels(models: IRefereeModel[]): IRefereesResData[] {
    return models.map(
      (model): IRefereesResData => RefereesResData.fromModel(model),
    );
  }
}
