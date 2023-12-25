import { IBaseParticipantModel } from "../../interfaces/models/base/IBaseParticipantModel";

export class BaseParticipantModel implements IBaseParticipantModel {
  constructor(
    public readonly participantId: number,
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
    public readonly playerId: number | null,
    readonly clubId: number | null,
  ) {}

  public static isValidModel(obj: unknown): obj is IBaseParticipantModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseParticipantModel = obj as IBaseParticipantModel;
    return (
      typeof model.participantId === "number" &&
      typeof model.username === "string" &&
      typeof model.password === "string" &&
      typeof model.email === "string" &&
      (typeof model.playerId === "number" || model.playerId === null) &&
      (typeof model.clubId === "number" || model.clubId === null)
    );
  }

  public static areValidModels(
    objs: unknown[],
  ): objs is IBaseParticipantModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseParticipantModel.isValidModel(obj));
  }
}
