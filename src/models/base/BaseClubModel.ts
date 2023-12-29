import { ClubState } from "../../core/enums/clubState";
import { IBaseClubModel } from "../../interfaces/models/base/IBaseClubModel";

export class BaseClubModel implements IBaseClubModel {
  constructor(
    public readonly clubId: number,
    public readonly leagueName: string | null,
    public readonly name: string,
    public readonly state: ClubState,
    public readonly playerCount: number,
    public readonly cupCount: number,
    public readonly participantEmail: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static isValidModel(obj: unknown): obj is IBaseClubModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseClubModel = obj as IBaseClubModel;
    return (
      typeof model.clubId === "number" &&
      (model.leagueName === null || typeof model.leagueName === "string") &&
      typeof model.name === "string" &&
      Object.values(ClubState).includes(model.state as ClubState) &&
      typeof model.playerCount === "string" &&
      typeof model.cupCount === "number" &&
      typeof model.participantEmail === "string" &&
      typeof model.description === "string" &&
      typeof model.logoPath === "string"
    );
  }

  public static areValidModels(objs: unknown[]): objs is IBaseClubModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseClubModel.isValidModel(obj));
  }

  public static isValidIdModel(obj: unknown): obj is IBaseClubModel {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const model: IBaseClubModel = obj as IBaseClubModel;
    return typeof model.clubId === "number";
  }

  public static areValidIdModels(objs: unknown[]): objs is IBaseClubModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => BaseClubModel.isValidIdModel(obj));
  }
}
