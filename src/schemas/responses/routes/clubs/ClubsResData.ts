import { ClubState } from "../../../../core/enums/clubState";
import { IClubModel } from "../../../../interfaces/models/IClubModel";
import { PrecisionLossError } from "../../../../interfaces/schemas/responses/common/IServerError";
import { IClubsResData } from "../../../../interfaces/schemas/responses/routes/clubs/IClubsResData";

export class ClubsResData implements IClubsResData {
  constructor(
    public readonly clubId: number,
    public readonly name: string,
    public readonly state: ClubState,
    public readonly playerCount: number,
    public readonly cupCount: number,
    public readonly email: string,
    public readonly description: string,
    public readonly logoPath: string,
  ) {}

  public static fromModel(model: IClubModel): IClubsResData {
    if (!Number.isSafeInteger(Number(model.playerCount))) {
      throw new PrecisionLossError("bigint", "number");
    }
    return new ClubsResData(
      model.clubId,
      model.name,
      model.state,
      Number(model.playerCount),
      model.cupCount,
      model.participantEmail,
      model.description,
      model.logoPath,
    );
  }

  public static fromModels(models: IClubModel[]): IClubsResData[] {
    return models.map((model): IClubsResData => ClubsResData.fromModel(model));
  }
}
