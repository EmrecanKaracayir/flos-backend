import { IBasePlayerModel } from "./base/IBasePlayerModel";

export interface IMyClubPlayerModel extends IBasePlayerModel {
  readonly clubId: number;
}
