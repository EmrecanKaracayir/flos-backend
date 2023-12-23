import { LeagueState } from "../../core/enums/leagueState";
import { IMyLeagueModel } from "../models/IMyLeagueModel";
import { IRecordExistsModel } from "../models/common/IRecordExistsModel";

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

  doesLeagueExistById: (leagueId: number) => Promise<IRecordExistsModel>;

  isLeagueMineByIds: (
    organizerId: number,
    leagueId: number,
  ) => Promise<IRecordExistsModel>;

  doesLeagueByIdInStates: (
    leagueId: number,
    allowedLeagueStates: LeagueState[],
  ) => Promise<boolean>;

  editLeague: (
    organizerId: number,
    leagueId: number,
    name: string,
    prize: number,
    description: string,
    logoPath: string,
  ) => Promise<IMyLeagueModel>;

  deleteLeague: (leagueId: number) => Promise<void>;
}

export enum MyLeaguesQueries {
  GET_MY_LEAGUE_MODELS_BY_$OID = `SELECT * FROM "MyLeagueView" WHERE "organizerId" = $1`,
  CREATE_LEAGUE_WITH_$OID_$NAME_$PRIZE_$DESC_$LPATH = `INSERT INTO "League" ("organizerId", name, prize, description, "logoPath") VALUES ($1, $2, $3, $4, $5) RETURNING "leagueId"`,
  GET_MY_LEAGUE_MODEL_BY_$OID_$LID = `SELECT * FROM "MyLeagueView" WHERE "organizerId" = $1 AND "leagueId" = $2`,
  DOES_LEAGUE_BY_$LID_EXIST = `SELECT EXISTS (SELECT * FROM "League" WHERE "leagueId" = $1) AS "recordExists"`,
  IS_LEAGUE_MINE_BY_$OID_$LID = `SELECT EXISTS (SELECT * FROM "League" WHERE "organizerId" = $1 AND "leagueId" = $2) AS "recordExists"`,
  GET_LEAGUE_STATE_BY_$LID = `SELECT state FROM "League" WHERE "leagueId" = $1`,
  EDIT_LEAGUE_WITH_$NAME_$PRIZE_$DESC_$LPATH_$LID = `UPDATE "League" SET name = $1, prize = $2, description = $3, "logoPath" = $4 WHERE "leagueId" = $5`,
  FREE_CLUBS_FROM_LEAGUE_BY_$LID = `UPDATE "Club" SET "leagueId" = NULL WHERE "leagueId" = $1`,
  DELETE_LEAGUE_BY_$LID = `DELETE FROM "League" WHERE "leagueId" = $1`,
}
