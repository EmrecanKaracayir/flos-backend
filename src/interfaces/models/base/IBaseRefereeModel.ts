import { RefereeLicenseType } from "../../../core/enums/refereeLicenseType";

export interface IBaseRefereeModel {
  readonly refereeId: number;
  readonly fullName: string;
  readonly age: number;
  readonly licenseType: RefereeLicenseType;
  readonly email: string;
  readonly imgPath: string;
}
