import { IParticipantModel } from "../interfaces/models/IParticipantModel";

export class ParticipantModel implements IParticipantModel {
  constructor(
    public readonly participantId: number,
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IParticipantModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: ParticipantModel = obj as IParticipantModel;
    return (
      typeof model.participantId === "number" &&
      typeof model.username === "string" &&
      typeof model.password === "string" &&
      typeof model.email === "string"
    );
  }
}
