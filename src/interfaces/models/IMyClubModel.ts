import { IBaseClubModel } from "./base/IBaseClubModel";

export interface IMyClubModel extends IBaseClubModel {
  readonly participantId: number;
}
