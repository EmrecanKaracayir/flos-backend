import { ILeagueModel } from "../models/ILeagueModel";

export interface ILeaguesProvider {
  getLeagueModels: () => Promise<ILeagueModel[]>;

  getLeagueModelById: (leagueId: number) => Promise<ILeagueModel | null>;
}

export enum LeaguesQueries {
  GET_LEAGUE_MODELS = `SELECT * FROM "LeagueView"`,
  GET_LEAGUE_MODEL_BY_$ID = `${GET_LEAGUE_MODELS} WHERE "leagueId" = $1`,
}
