import { LeagueState } from "../../core/enums/leagueState";
import { IMyLeagueModel } from "../models/IMyLeagueModel";
import { IRecordExistsModel } from "../models/common/IRecordExistsModel";

export interface IMyLeaguesProvider {
  getMyLeagueModels: (organizerId: number) => Promise<IMyLeagueModel[]>;

  createMyLeague: (
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

  doesMyLeagueExistById: (
    organizerId: number,
    leagueId: number,
  ) => Promise<IRecordExistsModel>;

  doesMyLeagueByIdInState: (
    leagueId: number,
    allowedLeagueStates: LeagueState[],
  ) => Promise<boolean>;

  updateMyLeague: (
    organizerId: number,
    leagueId: number,
    name: string,
    prize: number,
    description: string,
    logoPath: string,
  ) => Promise<IMyLeagueModel>;

  deleteMyLeague: (leagueId: number) => Promise<void>;
}

export enum MyLeaguesQueries {
  GET_MY_LEAGUES_$ORID = `SELECT * FROM "MyLeagueView" WHERE "organizerId" = $1`,
  CREATE_LEAGUE_$OID_$NAME_$PRIZE_$DESC_$LPATH = `INSERT INTO "League" ("organizerId", name, prize, description, "logoPath") VALUES ($1, $2, $3, $4, $5) RETURNING "leagueId"`,
  GET_MY_LEAGUE_$ORID_$LGID = `SELECT * FROM "MyLeagueView" WHERE "organizerId" = $1 AND "leagueId" = $2`,
  DOES_MY_LEAGUE_EXIST_$ORID_$LGID = `SELECT EXISTS (SELECT * FROM "League" WHERE "organizerId" = $1 AND "leagueId" = $2) AS "recordExists"`,
  GET_MY_LEAGUE_STATE_$LGID = `SELECT state FROM "MyLeagueView" WHERE "leagueId" = $1`,
  UPDATE_LEAGUE_$LGID_$NAME_$PRIZE_$DESC_$LPATH = `UPDATE "League" SET name = $2, prize = $3, description = $4, "logoPath" = $5 WHERE "leagueId" = $1`,
  FREE_LEAGUE_FROM_CLUBS_$LGID = `UPDATE "Club" SET "leagueId" = NULL WHERE "leagueId" = $1`,
  DELETE_LEAGUE_$LGID = `DELETE FROM "League" WHERE "leagueId" = $1`,
}
