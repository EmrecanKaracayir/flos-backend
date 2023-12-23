import { ClubState } from "../../../../../core/enums/clubState";
import { IMyClubModel } from "../../../../../interfaces/models/IMyClubModel";
import { PrecisionLossError } from "../../../../../interfaces/schemas/responses/common/IServerError";
import { IMyClubResData } from "../../../../../interfaces/schemas/responses/routes/my/club/IMyClubResData";

export class MyClubResData implements IMyClubResData {
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

  public static fromModel(model: IMyClubModel): IMyClubResData {
    if (!Number.isSafeInteger(Number(model.playerCount))) {
      throw new PrecisionLossError("bigint", "number");
    }
    return new MyClubResData(
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
}
