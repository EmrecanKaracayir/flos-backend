import { IMyLeagueClubModel } from "../interfaces/models/IMyLeagueClubModel";
import { IBaseClubModel } from "../interfaces/models/base/IBaseClubModel";
import { BaseClubModel } from "./base/BaseClubModel";

export class MyLeagueClubModel
  extends BaseClubModel
  implements IMyLeagueClubModel
{
  constructor(
    baseModel: IBaseClubModel,
    public readonly leagueId: number,
    public readonly played: number,
    public readonly wins: number,
    public readonly draws: number,
    public readonly losses: number,
    public readonly average: number,
    public readonly points: number,
  ) {
    super(
      baseModel.clubId,
      baseModel.leagueName,
      baseModel.name,
      baseModel.state,
      baseModel.playerCount,
      baseModel.cupCount,
      baseModel.participantEmail,
      baseModel.description,
      baseModel.logoPath,
    );
  }

  public static override isValidModel(obj: unknown): obj is IMyLeagueClubModel {
    if (super.isValidModel(obj) === false) {
      return false;
    }
    const model: IMyLeagueClubModel = obj as IMyLeagueClubModel;
    return (
      typeof model.leagueId === "number" &&
      typeof model.played === "number" &&
      typeof model.wins === "number" &&
      typeof model.draws === "number" &&
      typeof model.losses === "number" &&
      typeof model.average === "number" &&
      typeof model.points === "number"
    );
  }

  public static override areValidModels(
    objs: unknown[],
  ): objs is IMyLeagueClubModel[] {
    if (!Array.isArray(objs)) {
      return false;
    }
    return objs.every((obj): boolean => MyLeagueClubModel.isValidModel(obj));
  }
}
