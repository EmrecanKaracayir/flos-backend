import { ILeagueModel } from "../models/ILeagueModel";

export interface ILeaguesProvider {
  getLeagueModels: () => Promise<ILeagueModel[]>;

  getLeagueModelById: (leagueId: number) => Promise<ILeagueModel | null>;
}

export enum LeaguesQueries {
  GET_LEAGUES = `SELECT * FROM "LeagueView"`,
  GET_LEAGUE_$LGID = `SELECT * FROM "LeagueView" WHERE "leagueId" = $1`,
}
