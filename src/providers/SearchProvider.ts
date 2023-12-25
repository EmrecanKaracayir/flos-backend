import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IClubModel } from "../interfaces/models/IClubModel";
import { ILeagueModel } from "../interfaces/models/ILeagueModel";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import { IRefereeModel } from "../interfaces/models/IRefereeModel";
import { ISearchModel } from "../interfaces/models/ISearchModel";
import { IVenueModel } from "../interfaces/models/IVenueModel";
import {
  ISearchProvider,
  SearchQueries,
} from "../interfaces/providers/ISearchProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/app/IServerError";
import { SearchModel } from "../models/SearchModel";

export class SearchProvider implements ISearchProvider {
  public async getSearchResults(query: string): Promise<ISearchModel> {
    // Leagues
    let leagues: ILeagueModel[];
    const leagueRes: QueryResult = await pool.query(
      SearchQueries.GET_LEAGUES_$SEARCH,
      [query],
    );
    const leagueRecs: unknown[] = leagueRes.rows;
    if (!leagueRecs) {
      leagues = [];
    } else {
      leagues = leagueRecs as ILeagueModel[];
    }
    // Clubs
    let clubs: IClubModel[];
    const clubRes: QueryResult = await pool.query(
      SearchQueries.GET_CLUBS_$SEARCH,
      [query],
    );
    const clubRecs: unknown[] = clubRes.rows;
    if (!clubRecs) {
      clubs = [];
    } else {
      clubs = clubRecs as IClubModel[];
    }
    // Players
    let players: IPlayerModel[];
    const playerRes: QueryResult = await pool.query(
      SearchQueries.GET_PLAYERS_$SEARCH,
      [query],
    );
    const playerRecs: unknown[] = playerRes.rows;
    if (!playerRecs) {
      players = [];
    } else {
      players = playerRecs as IPlayerModel[];
    }
    // Referees
    let referees: IRefereeModel[];
    const refereeRes: QueryResult = await pool.query(
      SearchQueries.GET_REFEREES_$SEARCH,
      [query],
    );
    const refereeRecs: unknown[] = refereeRes.rows;
    if (!refereeRecs) {
      referees = [];
    } else {
      referees = refereeRecs as IRefereeModel[];
    }
    // Venues
    let venues: IVenueModel[];
    const venueRes: QueryResult = await pool.query(
      SearchQueries.GET_VENUES_$SEARCH,
      [query],
    );
    const venueRecs: unknown[] = venueRes.rows;
    if (!venueRecs) {
      venues = [];
    } else {
      venues = venueRecs as IVenueModel[];
    }
    // Create SearchModel
    const model: ISearchModel = new SearchModel(
      leagues,
      clubs,
      players,
      referees,
      venues,
    );
    if (!SearchModel.isValidModel(model)) {
      throw new ModelMismatchError(model);
    }
    return model as ISearchModel;
  }
}
