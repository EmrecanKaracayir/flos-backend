import { PlayerState } from "../../core/enums/playerState";
import { IMyClubModel } from "../models/IMyClubModel";
import { IRecordExistsModel } from "../models/common/IRecordExistsModel";

export interface IMyClubProvider {
  getMyClubModel: (participantId: number) => Promise<IMyClubModel | null>;

  doesMyClubExist: (participantId: number) => Promise<IRecordExistsModel>;

  doesMyPlayerExist: (participantId: number) => Promise<IRecordExistsModel>;

  doesMyPlayerInStates: (
    participantId: number,
    allowedPlayerStates: PlayerState[],
  ) => Promise<boolean>;

  createMyClub: (
    participantId: number,
    name: string,
    description: string,
    logoPath: string,
  ) => Promise<IMyClubModel>;
}

export enum MyClubQueries {
  GET_MY_CLUB_$PRID = `SELECT * FROM "MyClubView" WHERE "participantId" = $1`,
  DOES_MY_CLUB_EXIST_$PRID = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1 AND "clubId" IS NOT NULL) as "recordExists"`,
  DOES_MY_PLAYER_EXIST_$PRID = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1 AND "playerId" IS NOT NULL) as "recordExists"`,
  GET_MY_PLAYER_STATE_$PRID = `SELECT state FROM "MyPlayerView" WHERE "participantId" = $1`,
  CREATE_CLUB_$NAME_$DESC_$LPATH = `INSERT INTO "Club" (name, description, "logoPath") VALUES ($1, $2, $3) RETURNING "clubId"`,
  SET_CLID_IN_PARTICIPANT_$CLID_$PRID = `UPDATE "Participant" SET "clubId" = $1 WHERE "participantId" = $2`,
  GET_MY_PLID_$PRID = `SELECT "playerId" FROM "MyPlayerView" WHERE "participantId" = $1`,
  SET_CLID_IN_PLAYER_$CLID_$PLID = `UPDATE "Player" SET "clubId" = $1 WHERE "playerId" = $2`,
}
