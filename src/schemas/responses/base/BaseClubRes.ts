import { ClubState } from "../../../core/enums/clubState";
import { IBaseClubModel } from "../../../interfaces/models/base/IBaseClubModel";
import { PrecisionLossError } from "../../../interfaces/schemas/responses/app/IServerError";
import { IBaseClubRes } from "../../../interfaces/schemas/responses/base/IBaseClubRes";

export class BaseClubRes implements IBaseClubRes {
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
  ) {}

  public static fromModel(model: IBaseClubModel): IBaseClubRes {
    if (!Number.isSafeInteger(Number(model.playerCount))) {
      throw new PrecisionLossError("bigint", "number");
    }
    return new BaseClubRes(
      model.clubId,
      model.leagueName,
      model.name,
      model.state,
      Number(model.playerCount),
      model.cupCount,
      model.participantEmail,
      model.description,
      model.logoPath,
    );
  }

  public static fromModels(models: IBaseClubModel[]): IBaseClubRes[] {
    return models.map((model): IBaseClubRes => BaseClubRes.fromModel(model));
  }
}
