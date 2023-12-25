import { IBasePlayerModel } from "./base/IBasePlayerModel";

export interface IMyPlayerModel extends IBasePlayerModel {
  readonly participantId: number;
}
