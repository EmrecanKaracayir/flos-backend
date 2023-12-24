import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { DELETABLE_PLAYER_STATES } from "../core/rules/playerRules";
import { IMyPlayerModel } from "../interfaces/models/IMyPlayerModel";
import { IPlayerIdModel } from "../interfaces/models/common/IPlayerIdModel";
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
      MyPlayerQueries.GET_MY_PLAYER_$PRID,
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

  public async doesMyPlayerExist(participantId: number): Promise<boolean> {
    const reRes: QueryResult = await pool.query(
      MyPlayerQueries.DOES_MY_PLAYER_EXIST_$PRID,
      [participantId],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return (reRec as IRecordExistsModel).recordExists;
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
        MyPlayerQueries.CREATE_PLAYER_$FNAME_$BDAY_$BIO_$IPATH,
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
      await pool.query(MyPlayerQueries.SET_PLID_IN_PARTICIPANT_$PLID_$PRID, [
        (playerIdRec as IPlayerIdModel).playerId,
        participantId,
      ]);
      // Get MyPlayerModel
      const myPlayerRes: QueryResult = await pool.query(
        MyPlayerQueries.GET_MY_PLAYER_$PRID,
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

  public async updateMyPlayer(
    participantId: number,
    fullName: string,
    birthday: string,
    biography: string,
    imgPath: string,
  ): Promise<IMyPlayerModel> {
    await pool.query("BEGIN");
    try {
      // Get playerId from participant
      const playerIdRes: QueryResult = await pool.query(
        MyPlayerQueries.GET_MY_PLID_$PRID,
        [participantId],
      );
      const playerIdRec: unknown = playerIdRes.rows[0];
      if (!playerIdRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!PlayerIdModel.isValidModel(playerIdRec)) {
        throw new ModelMismatchError(playerIdRec);
      }
      // Update player
      await pool.query(
        MyPlayerQueries.UPDATE_PLAYER_$PLID_$FNAME_$BDAY_$BIO_$IPATH,
        [
          (playerIdRec as IPlayerIdModel).playerId,
          fullName,
          birthday,
          biography,
          imgPath,
        ],
      );
      // Get MyPlayerModel
      const myPlayerRes: QueryResult = await pool.query(
        MyPlayerQueries.GET_MY_PLAYER_$PRID,
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

  public async isMyPlayerDeletable(participantId: number): Promise<boolean> {
    const reRes: QueryResult = await pool.query(
      MyPlayerQueries.IS_MY_PLAYER_IN_STATE_$PRID_$STATES,
      [participantId, DELETABLE_PLAYER_STATES],
    );
    const reRec: unknown = reRes.rows[0];
    if (!reRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!RecordExistsModel.isValidModel(reRec)) {
      throw new ModelMismatchError(reRec);
    }
    return (reRec as IRecordExistsModel).recordExists;
  }

  public async deleteMyPlayer(participantId: number): Promise<void> {
    await pool.query("BEGIN");
    try {
      // Get playerId from participant
      const playerIdRes: QueryResult = await pool.query(
        MyPlayerQueries.GET_MY_PLID_$PRID,
        [participantId],
      );
      const playerIdRec: unknown = playerIdRes.rows[0];
      if (!playerIdRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!PlayerIdModel.isValidModel(playerIdRec)) {
        throw new ModelMismatchError(playerIdRec);
      }
      // Free player from participant
      await pool.query(MyPlayerQueries.FREE_PLAYER_FROM_PARTICIPANT_$PRID, [
        participantId,
      ]);
      // Delete player
      await pool.query(MyPlayerQueries.DELETE_PLAYER_$PLID, [
        (playerIdRec as IPlayerIdModel).playerId,
      ]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
