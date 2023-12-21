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
import { ModelMismatchError } from "../interfaces/schemas/responses/common/IServerError";
import { SearchModel } from "../models/SearchModel";

export class SearchProvider implements ISearchProvider {
  public async getSearchModel(query: string): Promise<ISearchModel> {
    // Leagues
    let leagueModels: ILeagueModel[];
    const leagueResult: QueryResult = await pool.query(
      SearchQueries.GET_LEAGUES_BY_NAME,
      [query],
    );
    const leagueRecords: unknown[] = leagueResult.rows;
    if (!leagueRecords) {
      leagueModels = [];
    } else {
      leagueModels = leagueRecords as ILeagueModel[];
    }
    // Clubs
    let clubModels: IClubModel[];
    const clubResult: QueryResult = await pool.query(
      SearchQueries.GET_CLUBS_BY_NAME,
      [query],
    );
    const clubRecords: unknown[] = clubResult.rows;
    if (!clubRecords) {
      clubModels = [];
    } else {
      clubModels = clubRecords as IClubModel[];
    }
    // Players
    let playerModels: IPlayerModel[];
    const playerResult: QueryResult = await pool.query(
      SearchQueries.GET_PLAYERS_BY_NAME,
      [query],
    );
    const playerRecords: unknown[] = playerResult.rows;
    if (!playerRecords) {
      playerModels = [];
    } else {
      playerModels = playerRecords as IPlayerModel[];
    }
    // Referees
    let refereeModels: IRefereeModel[];
    const refereeResult: QueryResult = await pool.query(
      SearchQueries.GET_REFEREES_BY_NAME,
      [query],
    );
    const refereeRecords: unknown[] = refereeResult.rows;
    if (!refereeRecords) {
      refereeModels = [];
    } else {
      refereeModels = refereeRecords as IRefereeModel[];
    }
    // Venues
    let venueModels: IVenueModel[];
    const venueResult: QueryResult = await pool.query(
      SearchQueries.GET_VENUES_BY_NAME,
      [query],
    );
    const venueRecords: unknown[] = venueResult.rows;
    if (!venueRecords) {
      venueModels = [];
    } else {
      venueModels = venueRecords as IVenueModel[];
    }
    // Create SearchModel
    const model: ISearchModel = new SearchModel(
      leagueModels,
      clubModels,
      playerModels,
      refereeModels,
      venueModels,
    );
    if (!SearchModel.isValidModel(model)) {
      throw new ModelMismatchError(model);
    }
    return model as ISearchModel;
  }
}
