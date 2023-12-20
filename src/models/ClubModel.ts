import { ClubState, IClubModel } from "../interfaces/models/IClubModel";

export class ClubModel implements IClubModel {
  constructor(
    public readonly clubId: number,
    public readonly name: string,
    public readonly state: ClubState,
    public readonly playerCount: number,
    public readonly cupCount: number,
    public readonly participantEmail: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IClubModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: ClubModel = obj as IClubModel;
    return (
      typeof model.clubId === "number" &&
      typeof model.name === "string" &&
      Object.values(ClubState).includes(model.state) &&
      typeof model.playerCount === "string" &&
      typeof model.cupCount === "number" &&
      typeof model.participantEmail === "string" &&
      typeof model.description === "string" &&
      typeof model.logoPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IClubModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => ClubModel.isValidModel(obj));
  }
}
