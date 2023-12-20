import { IPlayerModel, PlayerState } from "../interfaces/models/IPlayerModel";

export class PlayerModel implements IPlayerModel {
  constructor(
    public readonly playerId: number,
    public readonly clubName: string | null,
    public readonly fullName: string,
    public readonly state: PlayerState,
    public readonly age: number,
    public readonly goals: number,
    public readonly assists: number,
    public readonly participantEmail: string,
    public readonly biography: string,
    public readonly imgPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IPlayerModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IPlayerModel = obj as IPlayerModel;
    return (
      typeof model.playerId === "number" &&
      (typeof model.clubName === "string" || model.clubName === null) &&
      typeof model.fullName === "string" &&
      Object.values(PlayerState).includes(model.state) &&
      typeof model.age === "number" &&
      typeof model.goals === "number" &&
      typeof model.assists === "number" &&
      typeof model.participantEmail === "string" &&
      typeof model.biography === "string" &&
      typeof model.imgPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IPlayerModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => PlayerModel.isValidModel(obj));
  }
}
