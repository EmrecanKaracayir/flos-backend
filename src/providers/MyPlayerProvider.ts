import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import {
  DELETABLE_PLAYER_STATES,
  EDITABLE_PLAYER_STATES,
} from "../core/rules/playerRules";
import { IMyPlayerModel } from "../interfaces/models/IMyPlayerModel";
import { IExistsModel } from "../interfaces/models/util/IExistsModel";
import {
  IMyPlayerProvider,
  MyPlayerQueries,
} from "../interfaces/providers/IMyPlayerProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/app/IServerError";
import { MyPlayerModel } from "../models/MyPlayerModel";
import { PlayerModel } from "../models/PlayerModel";
import { ExistsModel } from "../models/util/ExistsModel";

export class MyPlayerProvider implements IMyPlayerProvider {
  public async getMyPlayer(
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
    const existsRes: QueryResult = await pool.query(
      MyPlayerQueries.DOES_MY_PLAYER_EXIST_$PRID,
      [participantId],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return (existsRec as IExistsModel).exists;
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
      if (!PlayerModel.isValidIdModel(playerIdRec)) {
        throw new ModelMismatchError(playerIdRec);
      }
      // Associate participant with playerId
      await pool.query(MyPlayerQueries.SET_PLID_IN_PARTICIPANT_$PLID_$PRID, [
        playerIdRec.playerId,
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

  public async isMyPlayerEditable(participantId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyPlayerQueries.IS_MY_PLAYER_IN_STATE_$PRID_$STATES,
      [participantId, EDITABLE_PLAYER_STATES],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return (existsRec as IExistsModel).exists;
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
      if (!PlayerModel.isValidIdModel(playerIdRec)) {
        throw new ModelMismatchError(playerIdRec);
      }
      // Update player
      await pool.query(
        MyPlayerQueries.UPDATE_PLAYER_$PLID_$FNAME_$BDAY_$BIO_$IPATH,
        [playerIdRec.playerId, fullName, birthday, biography, imgPath],
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
    const existsRes: QueryResult = await pool.query(
      MyPlayerQueries.IS_MY_PLAYER_IN_STATE_$PRID_$STATES,
      [participantId, DELETABLE_PLAYER_STATES],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return (existsRec as IExistsModel).exists;
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
      if (!PlayerModel.isValidIdModel(playerIdRec)) {
        throw new ModelMismatchError(playerIdRec);
      }
      // Free player from participant
      await pool.query(MyPlayerQueries.FREE_PLAYER_FROM_PARTICIPANT_$PRID, [
        participantId,
      ]);
      // Delete player
      await pool.query(MyPlayerQueries.DELETE_PLAYER_$PLID, [
        playerIdRec.playerId,
      ]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
