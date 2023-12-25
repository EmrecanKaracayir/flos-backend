import { IClubModel } from "../models/IClubModel";
import { IMyLeagueModel } from "../models/IMyLeagueModel";

export interface IMyLeaguesProvider {
  getMyLeagues: (organizerId: number) => Promise<IMyLeagueModel[]>;

  createMyLeague: (
    organizerId: number,
    name: string,
    prize: number,
    description: string,
    logoPath: string,
  ) => Promise<IMyLeagueModel>;

  getMyLeague: (
    organizerId: number,
    leagueId: number,
  ) => Promise<IMyLeagueModel | null>;

  doesMyLeagueExist: (
    organizerId: number,
    leagueId: number,
  ) => Promise<boolean>;

  isMyLeagueEditable: (leagueId: number) => Promise<boolean>;

  updateMyLeague: (
    organizerId: number,
    leagueId: number,
    name: string,
    prize: number,
    description: string,
    logoPath: string,
  ) => Promise<IMyLeagueModel>;

  isMyLeagueDeletable: (leagueId: number) => Promise<boolean>;

  deleteMyLeague: (leagueId: number) => Promise<void>;

  getMyLeagueClubs: (leagueId: number) => Promise<IClubModel[]>;
}

export enum MyLeaguesQueries {
  GET_MY_LEAGUES_$ORID = `SELECT * FROM "MyLeagueView" WHERE "organizerId" = $1`,
  CREATE_LEAGUE_$OID_$NAME_$PRIZE_$DESC_$LPATH = `INSERT INTO "League" ("organizerId", "name", "prize", "description", "logoPath") VALUES ($1, $2, $3, $4, $5) RETURNING "leagueId"`,
  GET_MY_LEAGUE_$ORID_$LGID = `SELECT * FROM "MyLeagueView" WHERE "organizerId" = $1 AND "leagueId" = $2`,
  DOES_MY_LEAGUE_EXIST_$ORID_$LGID = `SELECT EXISTS (SELECT * FROM "League" WHERE "organizerId" = $1 AND "leagueId" = $2) AS "exists"`,
  IS_MY_LEAGUE_IN_STATE_$PRID_$STATES = `SELECT EXISTS (SELECT "state" FROM "MyLeagueView" WHERE "leagueId" = $1 AND "state" = ANY($2::"LeagueState"[])) AS "exists"`,
  UPDATE_LEAGUE_$LGID_$NAME_$PRIZE_$DESC_$LPATH = `UPDATE "League" SET "name" = $2, "prize" = $3, "description" = $4, "logoPath" = $5 WHERE "leagueId" = $1`,
  FREE_LEAGUE_FROM_CLUBS_$LGID = `UPDATE "Club" SET "leagueId" = NULL WHERE "leagueId" = $1`,
  DELETE_LEAGUE_$LGID = `DELETE FROM "League" WHERE "leagueId" = $1`,
  GET_MY_LEAGUE_CLUBS_$LGID = `SELECT * FROM "Club" WHERE "leagueId" = $1`,
}
