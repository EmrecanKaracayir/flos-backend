export interface IRefereeModel {
  readonly refereeId: number;
  readonly fullName: string;
  readonly age: number;
  readonly licenseType: RefereeLicenseType;
  readonly email: string;
  readonly imgPath: string;
}

export enum RefereeLicenseType {
  CATEGORY_FIFA = "Category FIFA",
  CATEGORY_S = "Category S",
  CATEGORY_A = "Category A",
  CATEGORY_B = "Category B",
  CATEGORY_C = "Category C",
}
