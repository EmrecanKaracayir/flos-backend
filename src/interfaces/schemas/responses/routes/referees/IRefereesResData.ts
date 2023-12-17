import { RefereeLicenseType } from "../../../../models/IRefereeModel";

export interface IRefereesResData {
  readonly refereeId: number;
  readonly fullName: string;
  readonly age: number;
  readonly licenseType: RefereeLicenseType;
  readonly email: string;
  readonly imgPath: string;
}
