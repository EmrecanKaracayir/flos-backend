export interface IRefereeModel {
  readonly refereeId: number;
  readonly fullName: string;
  readonly birthday: Date;
  readonly licenseType: RefereeLicenseType;
  readonly email: string;
  readonly imgPath: string;
}

export enum RefereeLicenseType {
  X_CLASS = "X Class",
  S_CLASS = "S Class",
  A_CLASS = "A Class",
  B_CLASS = "B Class",
  C_CLASS = "C Class",
}
