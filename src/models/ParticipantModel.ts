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
    const { participantId, username, password, email } =
      obj as IParticipantModel;
    return (
      typeof participantId === "number" &&
      typeof username === "string" &&
      typeof password === "string" &&
      typeof email === "string"
    );
  }
}
