import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IMyPlayerModel } from "../interfaces/models/IMyPlayerModel";
import { IRecordExistsModel } from "../interfaces/models/IRecordExistsModel";
import {
  IMyPlayerProvider,
  MyPlayerQueries,
} from "../interfaces/providers/IMyPlayerProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/common/IServerError";
import { MyPlayerModel } from "../models/MyPlayerModel";
import { PlayerIdModel } from "../models/ParticipantIdModel";
import { RecordExistsModel } from "../models/RecordExistsModel";

export class MyPlayerProvider implements IMyPlayerProvider {
  public async getMyPlayerModel(
    participantId: number,
  ): Promise<IMyPlayerModel | null> {
    const result: QueryResult = await pool.query(
      MyPlayerQueries.GET_MY_PLAYER_MODEL_BY_$PID,
      [participantId],
    );
    const records: unknown = result.rows[0];
    if (!records) {
      return null;
    }
    if (!MyPlayerModel.isValidModel(records)) {
      throw new ModelMismatchError(records);
    }
    return records as IMyPlayerModel;
  }

  public async doesMyPlayerExist(
    participantId: number,
  ): Promise<IRecordExistsModel> {
    const result: QueryResult = await pool.query(
      MyPlayerQueries.DOES_MY_PLAYER_WITH_$PID_EXIST,
      [participantId],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IRecordExistsModel;
  }

  public async createMyPlayer(
    participantId: number,
    fullName: string,
    birthday: string,
    biography: string,
    imgPath: string,
  ): Promise<IMyPlayerModel> {
    const firstResult: QueryResult = await pool.query(
      MyPlayerQueries.CREATE_PLAYER_WITH_$FNAME_$BDAY_$BIO_$IPATH,
      [fullName, birthday, biography, imgPath],
    );
    const firstRecord: unknown = firstResult.rows[0];
    if (!firstRecord) {
      throw new UnexpectedQueryResultError();
    }
    if (!PlayerIdModel.isValidModel(firstRecord)) {
      throw new ModelMismatchError(firstRecord);
    }
    await pool.query(MyPlayerQueries.ASSOCIATE_PARTICIPANT_WITH_$PLID, [
      firstRecord.playerId,
      participantId,
    ]);
    const secondResult: QueryResult = await pool.query(
      MyPlayerQueries.GET_MY_PLAYER_MODEL_BY_$PID,
      [participantId],
    );
    const secondRecord: unknown = secondResult.rows[0];
    if (!secondRecord) {
      throw new UnexpectedQueryResultError();
    }
    if (!MyPlayerModel.isValidModel(secondRecord)) {
      throw new ModelMismatchError(secondRecord);
    }
    return secondRecord as IMyPlayerModel;
  }
}
