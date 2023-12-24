import { IMyClubModel } from "../models/IMyClubModel";

export interface IMyClubProvider {
  getMyClubModel: (participantId: number) => Promise<IMyClubModel | null>;

  doesMyClubExist: (participantId: number) => Promise<boolean>;

  doesMyPlayerExist: (participantId: number) => Promise<boolean>;

  isMyPlayerAvailable: (participantId: number) => Promise<boolean>;

  createMyClub: (
    participantId: number,
    name: string,
    description: string,
    logoPath: string,
  ) => Promise<IMyClubModel>;

  updateMyClub: (
    participantId: number,
    name: string,
    description: string,
    logoPath: string,
  ) => Promise<IMyClubModel>;

  isMyClubDeletable: (participantId: number) => Promise<boolean>;

  deleteMyClub: (participantId: number) => Promise<void>;
}

export enum MyClubQueries {
  GET_MY_CLUB_$PRID = `SELECT * FROM "MyClubView" WHERE "participantId" = $1`,
  DOES_MY_CLUB_EXIST_$PRID = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1 AND "clubId" IS NOT NULL) as "recordExists"`,
  DOES_MY_PLAYER_EXIST_$PRID = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1 AND "playerId" IS NOT NULL) AS "recordExists"`,
  IS_MY_PLAYER_IN_STATE_$PRID_$STATES = `SELECT EXISTS (SELECT state FROM "MyPlayerView" WHERE "participantId" = $1 AND state = ANY($2)) AS "recordExists"`,
  CREATE_CLUB_$NAME_$DESC_$LPATH = `INSERT INTO "Club" (name, description, "logoPath") VALUES ($1, $2, $3) RETURNING "clubId"`,
  SET_CLID_IN_PARTICIPANT_$CLID_$PRID = `UPDATE "Participant" SET "clubId" = $1 WHERE "participantId" = $2`,
  GET_MY_PLID_$PRID = `SELECT "playerId" FROM "MyPlayerView" WHERE "participantId" = $1`,
  SET_CLID_IN_PLAYER_$CLID_$PLID = `UPDATE "Player" SET "clubId" = $1 WHERE "playerId" = $2`,
  GET_MY_CLID_$PRID = `SELECT "clubId" FROM "Participant" WHERE "participantId" = $1`,
  UPDATE_CLUB_$CLID_$NAME_$DESC_$LPATH = `UPDATE "Club" SET name = $2, description = $3, "logoPath" = $4 WHERE "clubId" = $1 RETURNING "clubId"`,
  IS_MY_CLUB_IN_STATE_$PRID_$STATES = `SELECT EXISTS (SELECT state FROM "MyClubView
  " WHERE "participantId" = $1 AND state = ANY($2)) AS "recordExists"`,
  FREE_CLUB_FROM_PARTICIPANT_$PRID = `UPDATE "Participant" SET "clubId" = NULL WHERE "participantId" = $1`,
  FREE_CLUB_FROM_PLAYERS_$CLID = `UPDATE "Player" SET "clubId" = NULL WHERE "clubId" = $1`,
  DELETE_CLUB_$CLID = `DELETE FROM "Club" WHERE "clubId" = $1`,
}
