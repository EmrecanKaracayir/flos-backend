import { ISearchModel } from "../../../../interfaces/models/ISearchModel";
import { IClubsResData } from "../../../../interfaces/schemas/responses/routes/clubs/IClubsResData";
import { ILeaguesResData } from "../../../../interfaces/schemas/responses/routes/leagues/ILeaguesResData";
import { IPlayersResData } from "../../../../interfaces/schemas/responses/routes/players/IPlayersResData";
import { IRefereesResData } from "../../../../interfaces/schemas/responses/routes/referees/IRefereesResData";
import { ISearchResData } from "../../../../interfaces/schemas/responses/routes/search/ISearchResData";
import { IVenuesResData } from "../../../../interfaces/schemas/responses/routes/venues/IVenuesResData";
import { ClubsResData } from "../clubs/ClubsResData";
import { LeaguesResData } from "../leagues/LeaguesResData";
import { PlayersResData } from "../players/PlayersResData";
import { RefereesResData } from "../referees/RefereesResData";
import { VenuesResData } from "../venues/VenuesResData";

export class SearchResData implements ISearchResData {
  constructor(
    public readonly leagues: ILeaguesResData[],
    public readonly clubs: IClubsResData[],
    public readonly players: IPlayersResData[],
    public readonly referees: IRefereesResData[],
    public readonly venues: IVenuesResData[],
  ) {}

  public static fromModel(model: ISearchModel): ISearchResData {
    return new SearchResData(
      LeaguesResData.fromModels(model.leagueModels),
      ClubsResData.fromModels(model.clubModels),
      PlayersResData.fromModels(model.playerModels),
      RefereesResData.fromModels(model.refereeModels),
      VenuesResData.fromModels(model.venueModels),
    );
  }
}
