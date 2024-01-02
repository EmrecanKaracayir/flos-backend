import { ClubState } from "../../../core/enums/clubState";
import { IMyLeagueClubModel } from "../../../interfaces/models/IMyLeagueClubModel";
import { PrecisionLossError } from "../../../interfaces/schemas/responses/app/IServerError";
import { IBaseLeagueClubRes } from "../../../interfaces/schemas/responses/base/IBaseLeagueClubRes";

export class BaseLeagueClubRes implements IBaseLeagueClubRes {
  constructor(
    public readonly clubId: number,
    public readonly leagueName: string | null,
    public readonly name: string,
    public readonly state: ClubState,
    public readonly playerCount: number,
    public readonly cupCount: number,
    public readonly email: string,
    public readonly description: string,
    public readonly logoPath: string,
    public readonly played: number,
    public readonly wins: number,
    public readonly draws: number,
    public readonly losses: number,
    public readonly average: number,
    public readonly points: number,
  ) {}

  public static fromModel(model: IMyLeagueClubModel): IBaseLeagueClubRes {
    if (!Number.isSafeInteger(Number(model.playerCount))) {
      throw new PrecisionLossError("bigint", "number");
    }
    return new BaseLeagueClubRes(
      model.clubId,
      model.leagueName,
      model.name,
      model.state,
      Number(model.playerCount),
      model.cupCount,
      model.participantEmail,
      model.description,
      model.logoPath,
      model.played,
      model.wins,
      model.draws,
      model.losses,
      model.average,
      model.points,
    );
  }

  public static fromModels(models: IMyLeagueClubModel[]): IBaseLeagueClubRes[] {
    return models.map(
      (model): IBaseLeagueClubRes => BaseLeagueClubRes.fromModel(model),
    );
  }
}
