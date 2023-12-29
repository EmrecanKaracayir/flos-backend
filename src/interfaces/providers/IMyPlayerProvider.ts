import { IMyPlayerModel } from "../models/IMyPlayerModel";

export interface IMyPlayerProvider {
  getMyPlayer: (participantId: number) => Promise<IMyPlayerModel | null>;

  doesMyPlayerExist: (participantId: number) => Promise<boolean>;

  createMyPlayer: (
    participantId: number,
    fullName: string,
    birthday: string,
    biography: string,
    imgPath: string,
  ) => Promise<IMyPlayerModel>;

  isMyPlayerEditable: (participantId: number) => Promise<boolean>;

  updateMyPlayer: (
    participantId: number,
    fullName: string,
    birthday: string,
    biography: string,
    imgPath: string,
  ) => Promise<IMyPlayerModel>;

  isMyPlayerDeletable: (participantId: number) => Promise<boolean>;

  deleteMyPlayer: (participantId: number) => Promise<void>;
}

export enum MyPlayerQueries {
  GET_MY_PLAYER_$PRID = `SELECT * FROM "MyPlayerView" WHERE "participantId" = $1`,
  DOES_MY_PLAYER_EXIST_$PRID = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1 AND "playerId" IS NOT NULL) AS "exists"`,
  CREATE_PLAYER_$FNAME_$BDAY_$BIO_$IPATH = `INSERT INTO "Player" ("fullName", "birthday", "biography", "imgPath") VALUES ($1, $2, $3, $4) RETURNING "playerId"`,
  SET_PLID_IN_PARTICIPANT_$PLID_$PRID = `UPDATE "Participant" SET "playerId" = $1 WHERE "participantId" = $2`,
  GET_MY_PLID_$PRID = `SELECT "playerId" FROM "Participant" WHERE "participantId" = $1`,
  UPDATE_PLAYER_$PLID_$FNAME_$BDAY_$BIO_$IPATH = `UPDATE "Player" SET "fullName" = $2, "birthday" = $3, "biography" = $4, "imgPath" = $5 WHERE "playerId" = $1`,
  IS_MY_PLAYER_IN_STATE_$PRID_$STATES = `SELECT EXISTS (SELECT "state" FROM "MyPlayerView" WHERE "participantId" = $1 AND "state" = ANY($2::"PlayerState"[])) AS "exists"`,
  FREE_PLAYER_FROM_PARTICIPANT_$PRID = `UPDATE "Participant" SET "playerId" = NULL WHERE "participantId" = $1`,
  DELETE_PLAYER_$PLID = `DELETE FROM "Player" WHERE "playerId" = $1`,
}
