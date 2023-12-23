import { PlayerState } from "../../core/enums/playerState";
import { IPlayerStateModel } from "../../interfaces/models/common/IPlayerStateModel";

export class PlayerStateModel implements IPlayerStateModel {
  constructor(public readonly state: PlayerState) {}

  public static isValidModel(obj: unknown): obj is IPlayerStateModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IPlayerStateModel = obj as IPlayerStateModel;
    return Object.values(PlayerState).includes(model.state as PlayerState);
  }
}
