import { IMyPlayerModel } from "../models/IMyPlayerModel";
import { IRecordExistsModel } from "../models/common/IRecordExistsModel";

export interface IMyPlayerProvider {
  getMyPlayerModel: (participantId: number) => Promise<IMyPlayerModel | null>;

  doesMyPlayerExist: (participantId: number) => Promise<IRecordExistsModel>;

  createMyPlayer: (
    participantId: number,
    fullName: string,
    birthday: string,
    biography: string,
    imgPath: string,
  ) => Promise<IMyPlayerModel>;
}

export enum MyPlayerQueries {
  GET_MY_PLAYER_MODEL_BY_$PID = `SELECT * FROM "MyPlayerView" WHERE "participantId" = $1`,
  DOES_MY_PLAYER_BY_$PID_EXIST = `SELECT EXISTS (SELECT * FROM "Participant" WHERE "participantId" = $1 AND "playerId" IS NOT NULL) as "recordExists"`,
  CREATE_PLAYER_WITH_$FNAME_$BDAY_$BIO_$IPATH = `INSERT INTO "Player" ("fullName", birthday, biography, "imgPath") VALUES ($1, $2, $3, $4) RETURNING "playerId"`,
  ASSOCIATE_PARTICIPANT_WITH_$PLID_$PID = `UPDATE "Participant" SET "playerId" = $1 WHERE "participantId" = $2`,
}
