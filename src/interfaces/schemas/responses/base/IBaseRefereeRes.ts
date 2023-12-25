import { RefereeLicenseType } from "../../../../core/enums/refereeLicenseType";

export interface IBaseRefereeRes {
  readonly refereeId: number;
  readonly fullName: string;
  readonly age: number;
  readonly licenseType: RefereeLicenseType;
  readonly email: string;
  readonly imgPath: string;
}
