import { IClubsRes } from "../../../../../../interfaces/schemas/responses/routes/clubs/IClubsRes";
import { IMyLeagues$Res } from "../../../../../../interfaces/schemas/responses/routes/my/leagues/$leagueId/IMyLeagues$Res";
import { BaseLeagueRes } from "../../../../base/BaseLeagueRes";

export class MyLeagues$Res extends BaseLeagueRes implements IMyLeagues$Res {
  constructor(
    baseModel: BaseLeagueRes,
    public readonly clubs: IClubsRes[],
  ) {
    super(
      baseModel.leagueId,
      baseModel.name,
      baseModel.state,
      baseModel.prize,
      baseModel.email,
      baseModel.description,
      baseModel.logoPath,
    );
  }
}
