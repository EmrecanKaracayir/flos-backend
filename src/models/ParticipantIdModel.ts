import { IParticipantIdModel } from "../interfaces/models/IParticipantIdModel";

export class ParticipantIdModel implements IParticipantIdModel {
  constructor(public readonly participantId: number) {}

  public static isValidModel(obj: unknown): obj is IParticipantIdModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IParticipantIdModel = obj as IParticipantIdModel;
    return typeof model.participantId === "number";
  }
}
