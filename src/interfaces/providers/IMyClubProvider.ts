import { IMyClubModel } from "../models/IMyClubModel";
import { IMyClubPlayerModel } from "../models/IMyClubPlayerModel";
import { IPlayerModel } from "../models/IPlayerModel";

export interface IMyClubProvider {
  getMyClub: (participantId: number) => Promise<IMyClubModel | null>;

  doesMyClubExist: (participantId: number) => Promise<boolean>;

  doesMyPlayerExist: (participantId: number) => Promise<boolean>;

  isMyPlayerAvailable: (participantId: number) => Promise<boolean>;

  createMyClub: (
    participantId: number,
    name: string,
    description: string,
    logoPath: string,
  ) => Promise<IMyClubModel>;

  isMyClubEditable: (participantId: number) => Promise<boolean>;

  updateMyClub: (
    participantId: number,
    name: string,
    description: string,
    logoPath: string,
  ) => Promise<IMyClubModel>;

  isMyClubDeletable: (participantId: number) => Promise<boolean>;

  deleteMyClub: (participantId: number) => Promise<void>;

  getMyClubPlayers: (participantId: number) => Promise<IMyClubPlayerModel[]>;

  doesPlayerExist: (playerId: number) => Promise<boolean>;

  isPlayerAvailable: (playerId: number) => Promise<boolean>;

  addPlayerToMyClub: (
    participantId: number,
    playerId: number,
  ) => Promise<IPlayerModel>;

  isPlayerInMyClub: (
    participantId: number,
    playerId: number,
  ) => Promise<boolean>;

  isPlayerMine: (participantId: number, playerId: number) => Promise<boolean>;

  removePlayerFromMyClub: (playerId: number) => Promise<void>;
}

export enum MyClubQueries {
  GET_MY_CLUB_$PRID = `SELECT * FROM "MyClubView" WHERE "participantId" = $1`,
  DOES_MY_CLUB_EXIST_$PRID = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1 AND "clubId" IS NOT NULL) AS "exists"`,
  DOES_MY_PLAYER_EXIST_$PRID = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1 AND "playerId" IS NOT NULL) AS "exists"`,
  IS_MY_PLAYER_IN_STATE_$PRID_$STATES = `SELECT EXISTS (SELECT "state" FROM "MyPlayerView" WHERE "participantId" = $1 AND "state" = ANY($2::"PlayerState"[])) AS "exists"`,
  CREATE_CLUB_$NAME_$DESC_$LPATH = `INSERT INTO "Club" ("name", "description", "logoPath") VALUES ($1, $2, $3) RETURNING "clubId"`,
  SET_CLID_IN_PARTICIPANT_$CLID_$PRID = `UPDATE "Participant" SET "clubId" = $1 WHERE "participantId" = $2`,
  GET_MY_PLID_$PRID = `SELECT "playerId" FROM "MyPlayerView" WHERE "participantId" = $1`,
  GET_MY_CLID_$PRID = `SELECT "clubId" FROM "Participant" WHERE "participantId" = $1`,
  UPDATE_CLUB_$CLID_$NAME_$DESC_$LPATH = `UPDATE "Club" SET name = $2, description = $3, "logoPath" = $4 WHERE "clubId" = $1 RETURNING "clubId"`,
  IS_MY_CLUB_IN_STATE_$PRID_$STATES = `SELECT EXISTS (SELECT "state" FROM "MyClubView" WHERE "participantId" = $1 AND "state" = ANY($2::"ClubState"[])) AS "exists"`,
  FREE_CLUB_FROM_PARTICIPANT_$PRID = `UPDATE "Participant" SET "clubId" = NULL WHERE "participantId" = $1`,
  FREE_CLUB_FROM_PLAYERS_$CLID = `UPDATE "Player" SET "clubId" = NULL WHERE "clubId" = $1`,
  DELETE_CLUB_$CLID = `DELETE FROM "Club" WHERE "clubId" = $1`,
  GET_MY_CLUB_PLAYERS_$PRID = `SELECT * FROM "MyClubPlayerView" WHERE "clubId" = (SELECT "clubId" FROM "Participant" WHERE "participantId" = $1)`,
  DOES_PLAYER_EXIST_$PLID = `SELECT EXISTS (SELECT * FROM "Player" WHERE "playerId" = $1) AS "exists"`,
  IS_PLAYER_IN_STATE_$PLID_$STATES = `SELECT EXISTS (SELECT "state" FROM "PlayerView" WHERE "playerId" = $1 AND "state" = ANY($2::"PlayerState"[])) AS "exists"`,
  ADD_PLAYER_TO_CLUB_$CLID_$PLID = `UPDATE "Player" SET "clubId" = $1 WHERE "playerId" = $2`,
  GET_PLAYER_$PLID = `SELECT * FROM "PlayerView" WHERE "playerId" = $1`,
  IS_PLAYER_IN_MY_CLUB_$PRID_$PLID = `SELECT EXISTS (SELECT "playerId" FROM "Player" WHERE "playerId" = $2 AND "clubId" = (SELECT "clubId" FROM "MyClubView" WHERE "participantId" = $1)) AS "exists"`,
  IS_PLAYER_MINE_$PRID_$PLID = `SELECT EXISTS (SELECT "playerId" FROM "Participant" WHERE "participantId" = $1 AND "playerId" = $2) AS "exists"`,
  REMOVE_PLAYER_FROM_CLUB_$PLID = `UPDATE "Player" SET "clubId" = NULL WHERE "playerId" = $1`,
}
