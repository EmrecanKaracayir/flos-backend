import { IMyLeagueModel } from "../models/IMyLeagueModel";

export interface IMyLeaguesProvider {
  getMyLeagueModels: (organizerId: number) => Promise<IMyLeagueModel[]>;

  createLeague: (
    organizerId: number,
    name: string,
    prize: number,
    description: string,
    logoPath: string,
  ) => Promise<IMyLeagueModel>;

  getMyLeagueModelById: (
    organizerId: number,
    leagueId: number,
  ) => Promise<IMyLeagueModel | null>;
}

export enum MyLeaguesQueries {
  GET_MY_LEAGUE_MODELS_BY_$OID = `SELECT * FROM "MyLeagueView" WHERE "organizerId" = $1`,
  CREATE_LEAGUE_WITH_$OID_$NAME_$PRIZE_$DESC_$LPATH = `INSERT INTO "League" ("organizerId", name, prize, description, "logoPath") VALUES ($1, $2, $3, $4, $5) RETURNING "leagueId"`,
  GET_MY_LEAGUE_MODEL_BY_$OID_$LID = `SELECT * FROM "MyLeagueView" WHERE "organizerId" = $1 AND "leagueId" = $2`,
}
