import { IMyClubRes } from "../../../../../interfaces/schemas/responses/routes/my/club/IMyClubRes";
import { IPlayersRes } from "../../../../../interfaces/schemas/responses/routes/players/IPlayersRes";
import { BaseClubRes } from "../../../base/BaseClubRes";

export class MyClubRes extends BaseClubRes implements IMyClubRes {
  constructor(
    baseModel: BaseClubRes,
    public readonly players: IPlayersRes[],
  ) {
    super(
      baseModel.clubId,
      baseModel.leagueName,
      baseModel.name,
      baseModel.state,
      baseModel.playerCount,
      baseModel.cupCount,
      baseModel.email,
      baseModel.description,
      baseModel.logoPath,
    );
  }
}
