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

  public static fromModel(refereeModel: IRefereeModel): IRefereesResData {
    return new RefereesResData(
      refereeModel.refereeId,
      refereeModel.fullName,
      refereeModel.age,
      refereeModel.licenseType,
      refereeModel.email,
      refereeModel.imgPath,
    );
  }

  public static fromModels(refereeModels: IRefereeModel[]): IRefereesResData[] {
    return refereeModels.map(
      (refereeModel): IRefereesResData =>
        RefereesResData.fromModel(refereeModel),
    );
  }
}
