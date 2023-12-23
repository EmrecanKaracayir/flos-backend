import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IMyPlayerModel } from "../interfaces/models/IMyPlayerModel";
import { IRecordExistsModel } from "../interfaces/models/common/IRecordExistsModel";
import {
  IMyPlayerProvider,
  MyPlayerQueries,
} from "../interfaces/providers/IMyPlayerProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/common/IServerError";
import { MyPlayerModel } from "../models/MyPlayerModel";
import { PlayerIdModel } from "../models/common/PlayerIdModel";
import { RecordExistsModel } from "../models/common/RecordExistsModel";

export class MyPlayerProvider implements IMyPlayerProvider {
  public async getMyPlayerModel(
    participantId: number,
  ): Promise<IMyPlayerModel | null> {
    const myPlayerRes: QueryResult = await pool.query(
      MyPlayerQueries.GET_MY_PLAYER_MODEL_BY_$PID,
      [participantId],
    );
    const myPlayerRec: unknown = myPlayerRes.rows[0];
    if (!myPlayerRec) {
      return null;
    }
    if (!MyPlayerModel.isValidModel(myPlayerRec)) {
      throw new ModelMismatchError(myPlayerRec);
    }
    return myPlayerRec as IMyPlayerModel;
  }

  public async doesMyPlayerExist(
    participantId: number,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      MyPlayerQueries.DOES_MY_PLAYER_BY_$PID_EXIST,
      [participantId],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return reRec as IRecordExistsModel;
  }

  public async createMyPlayer(
    participantId: number,
    fullName: string,
    birthday: string,
    biography: string,
    imgPath: string,
  ): Promise<IMyPlayerModel> {
    await pool.query("BEGIN");
    try {
      // Create player and return its playerId
      const playerIdRes: QueryResult = await pool.query(
        MyPlayerQueries.CREATE_PLAYER_WITH_$FNAME_$BDAY_$BIO_$IPATH,
        [fullName, birthday, biography, imgPath],
      );
      const playerIdRec: unknown = playerIdRes.rows[0];
      if (!playerIdRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!PlayerIdModel.isValidModel(playerIdRec)) {
        throw new ModelMismatchError(playerIdRec);
      }
      // Associate participant with playerId
      await pool.query(MyPlayerQueries.ASSOCIATE_PARTICIPANT_WITH_$PLID_$PID, [
        playerIdRec.playerId,
        participantId,
      ]);
      // Get MyPlayerModel
      const myPlayerRes: QueryResult = await pool.query(
        MyPlayerQueries.GET_MY_PLAYER_MODEL_BY_$PID,
        [participantId],
      );
      const myPlayerRec: unknown = myPlayerRes.rows[0];
      if (!myPlayerRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!MyPlayerModel.isValidModel(myPlayerRec)) {
        throw new ModelMismatchError(myPlayerRec);
      }
      await pool.query("COMMIT");
      // Return MyPlayerModel
      return myPlayerRec as IMyPlayerModel;
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
