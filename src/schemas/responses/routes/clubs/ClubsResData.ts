import {
  ClubState,
  IClubModel,
} from "../../../../interfaces/models/IClubModel";
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

  public static fromModel(clubModel: IClubModel): IClubsResData {
    if (!Number.isSafeInteger(Number(clubModel.playerCount))) {
      throw new PrecisionLossError("bigint", "number");
    }
    return new ClubsResData(
      clubModel.clubId,
      clubModel.name,
      clubModel.state,
      Number(clubModel.playerCount),
      clubModel.cupCount,
      clubModel.participantEmail,
      clubModel.description,
      clubModel.logoPath,
    );
  }

  public static fromModels(clubModels: IClubModel[]): IClubsResData[] {
    return clubModels.map(
      (clubModels): IClubsResData => ClubsResData.fromModel(clubModels),
    );
  }
}
