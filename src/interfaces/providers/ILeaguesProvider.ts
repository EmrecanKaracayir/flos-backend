import { ILeagueModel } from "../models/ILeagueModel";

export interface ILeaguesProvider {
  getLeagues: () => Promise<ILeagueModel[]>;

  getLeague: (leagueId: number) => Promise<ILeagueModel | null>;
}

export enum LeaguesQueries {
  GET_LEAGUES = `SELECT * FROM "LeagueView"`,
  GET_LEAGUE_$LGID = `SELECT * FROM "LeagueView" WHERE "leagueId" = $1`,
}
