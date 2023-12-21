import { ISearchModel } from "../models/ISearchModel";

export interface ISearchProvider {
  getSearchModel: (query: string) => Promise<ISearchModel>;
}

export enum SearchQueries {
  GET_LEAGUES_BY_NAME = `SELECT * FROM "LeagueView" WHERE "name" ILIKE '%' || $1 || '%'`,
  GET_CLUBS_BY_NAME = `SELECT * FROM "ClubView" WHERE "name" ILIKE '%' || $1 || '%'`,
  GET_PLAYERS_BY_NAME = `SELECT * FROM "PlayerView" WHERE "fullName" ILIKE '%' || $1 || '%'`,
  GET_REFEREES_BY_NAME = `SELECT * FROM "RefereeView" WHERE "fullName" ILIKE '%' || $1 || '%'`,
  GET_VENUES_BY_NAME = `SELECT * FROM "VenueView" WHERE "name" ILIKE '%' || $1 || '%'`,
}
