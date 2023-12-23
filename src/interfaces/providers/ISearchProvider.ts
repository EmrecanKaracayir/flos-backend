import { ISearchModel } from "../models/ISearchModel";

export interface ISearchProvider {
  getSearchModel: (query: string) => Promise<ISearchModel>;
}

export enum SearchQueries {
  GET_LEAGUES_$SEARCH = `SELECT * FROM "LeagueView" WHERE "name" ILIKE '%' || $1 || '%'`,
  GET_CLUBS_$SEARCH = `SELECT * FROM "ClubView" WHERE "name" ILIKE '%' || $1 || '%'`,
  GET_PLAYERS_$SEARCH = `SELECT * FROM "PlayerView" WHERE "fullName" ILIKE '%' || $1 || '%'`,
  GET_REFEREES_$SEARCH = `SELECT * FROM "RefereeView" WHERE "fullName" ILIKE '%' || $1 || '%'`,
  GET_VENUES_$SEARCH = `SELECT * FROM "VenueView" WHERE "name" ILIKE '%' || $1 || '%'`,
}
