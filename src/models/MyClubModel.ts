import { ClubState } from "../core/enums/clubState";
import { IMyClubModel } from "../interfaces/models/IMyClubModel";

export class MyClubModel implements IMyClubModel {
  constructor(
    public readonly clubId: number,
    public readonly participantId: number,
    public readonly name: string,
    public readonly state: ClubState,
    public readonly playerCount: number,
    public readonly cupCount: number,
    public readonly participantEmail: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IMyClubModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IMyClubModel = obj as IMyClubModel;
    return (
      typeof model.clubId === "number" &&
      typeof model.participantId === "number" &&
      typeof model.name === "string" &&
      Object.values(ClubState).includes(model.state as ClubState) &&
      typeof model.playerCount === "string" &&
      typeof model.cupCount === "number" &&
      typeof model.participantEmail === "string" &&
      typeof model.description === "string" &&
      typeof model.logoPath === "string"
    );
  }
}
