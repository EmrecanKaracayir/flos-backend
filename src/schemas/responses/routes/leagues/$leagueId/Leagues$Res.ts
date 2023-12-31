import { IBaseLeagueClubRes } from "../../../../../interfaces/schemas/responses/base/IBaseLeagueClubRes";
import { ILeagues$Res } from "../../../../../interfaces/schemas/responses/routes/leagues/$leagueId/ILeagues$Res";
import { BaseLeagueRes } from "../../../base/BaseLeagueRes";

export class Leagues$Res extends BaseLeagueRes implements ILeagues$Res {
  constructor(
    baseModel: BaseLeagueRes,
    public readonly clubs: IBaseLeagueClubRes[],
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
