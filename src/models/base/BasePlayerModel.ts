import { PlayerState } from "../../core/enums/playerState";
import { IBasePlayerModel } from "../../interfaces/models/base/IBasePlayerModel";

export class BasePlayerModel implements IBasePlayerModel {
  constructor(
    public readonly playerId: number,
    public readonly clubName: string | null,
    public readonly fullName: string,
    public readonly state: PlayerState,
    public readonly age: number,
    public readonly goals: string,
    public readonly assists: string,
    public readonly participantEmail: string,
    public readonly biography: string,
    public readonly imgPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IBasePlayerModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBasePlayerModel = obj as IBasePlayerModel;
    return (
      typeof model.playerId === "number" &&
      (typeof model.clubName === "string" || model.clubName === null) &&
      typeof model.fullName === "string" &&
      Object.values(PlayerState).includes(model.state as PlayerState) &&
      typeof model.age === "number" &&
      typeof model.goals === "string" &&
      typeof model.assists === "string" &&
      typeof model.participantEmail === "string" &&
      typeof model.biography === "string" &&
      typeof model.imgPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IBasePlayerModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BasePlayerModel.isValidModel(obj));
  }

  public static isValidIdModel(obj: unknown): obj is IBasePlayerModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBasePlayerModel = obj as IBasePlayerModel;
    return typeof model.playerId === "number";
  }

  public static areValidIdModels(objs: unknown[]): objs is IBasePlayerModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BasePlayerModel.isValidIdModel(obj));
  }
}
