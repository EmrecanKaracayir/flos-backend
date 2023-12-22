import { PlayerState } from "../core/enums/playerState";
import { IMyPlayerModel } from "../interfaces/models/IMyPlayerModel";

export class MyPlayerModel implements IMyPlayerModel {
  constructor(
    public readonly playerId: number,
    public readonly participantId: number,
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

  public static isValidModel(obj: unknown): obj is IMyPlayerModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IMyPlayerModel = obj as IMyPlayerModel;
    return (
      typeof model.playerId === "number" &&
      typeof model.participantId === "number" &&
      (typeof model.clubName === "string" || model.clubName === null) &&
      typeof model.fullName === "string" &&
      Object.values(PlayerState).includes(model.state as PlayerState) &&
      typeof model.age === "number" &&
      typeof model.goals === "number" &&
      typeof model.assists === "number" &&
      typeof model.participantEmail === "string" &&
      typeof model.biography === "string" &&
      typeof model.imgPath === "string"
    );
  }
}
