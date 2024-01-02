import { ILeagueModel } from "../models/ILeagueModel";
import { IMyLeagueClubModel } from "../models/IMyLeagueClubModel";

export interface ILeaguesProvider {
  getLeagues: () => Promise<ILeagueModel[]>;

  getLeague: (leagueId: number) => Promise<ILeagueModel | null>;

  getLeagueClubs: (leagueId: number) => Promise<IMyLeagueClubModel[]>;
}

export enum LeaguesQueries {
  GET_LEAGUES = `SELECT * FROM "LeagueView"`,
  GET_LEAGUE_$LGID = `SELECT * FROM "LeagueView" WHERE "leagueId" = $1`,
  GET_LEAGUE_CLUBS_$LGID = `SELECT * FROM "MyLeagueClubView" WHERE "leagueId" = $1`,
}
