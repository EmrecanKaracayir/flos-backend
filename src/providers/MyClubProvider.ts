import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { PlayerState } from "../core/enums/playerState";
import { IMyClubModel } from "../interfaces/models/IMyClubModel";
import { IClubIdModel } from "../interfaces/models/common/IClubIdModel";
import { IPlayerIdModel } from "../interfaces/models/common/IPlayerIdModel";
import { IPlayerStateModel } from "../interfaces/models/common/IPlayerStateModel";
import { IRecordExistsModel } from "../interfaces/models/common/IRecordExistsModel";
import {
  IMyClubProvider,
  MyClubQueries,
} from "../interfaces/providers/IMyClubProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/common/IServerError";
import { MyClubModel } from "../models/MyClubModel";
import { ClubIdModel } from "../models/common/ClubIdModel";
import { PlayerIdModel } from "../models/common/PlayerIdModel";
import { PlayerStateModel } from "../models/common/PlayerStateModel";
import { RecordExistsModel } from "../models/common/RecordExistsModel";

export class MyClubProvider implements IMyClubProvider {
  public async getMyClubModel(
    participantId: number,
  ): Promise<IMyClubModel | null> {
    const myClubRes: QueryResult = await pool.query(
      MyClubQueries.GET_MY_CLUB_MODEL_BY_$PID,
      [participantId],
    );
    const myClubRec: unknown = myClubRes.rows[0];
    if (!myClubRec) {
      return null;
    }
    if (!MyClubModel.isValidModel(myClubRec)) {
      throw new ModelMismatchError(myClubRec);
    }
    return myClubRec as IMyClubModel;
  }

  public async doesMyClubExist(
    participantId: number,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      MyClubQueries.DOES_MY_CLUB_BY_$PID_EXIST,
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

  public async doesMyPlayerExist(
    participantId: number,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      MyClubQueries.DOES_MY_PLAYER_BY_$PID_EXIST,
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

  public async doesMyPlayerInStates(
    participantId: number,
    allowedPlayerStates: PlayerState[],
  ): Promise<boolean> {
    const playerStateRes: QueryResult = await pool.query(
      MyClubQueries.GET_MY_PLAYER_STATE_BY_$PID,
      [participantId],
    );
    const playerStateRec: unknown = playerStateRes.rows[0];
    if (!playerStateRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!PlayerStateModel.isValidModel(playerStateRec)) {
      throw new ModelMismatchError(playerStateRec);
    }
    return allowedPlayerStates.includes(
      (playerStateRec as IPlayerStateModel).state,
    );
  }

  public async createMyClub(
    participantId: number,
    name: string,
    description: string,
    logoPath: string,
  ): Promise<IMyClubModel> {
    await pool.query("BEGIN");
    try {
      // Create club and return its clubId
      const clubIdRes: QueryResult = await pool.query(
        MyClubQueries.CREATE_CLUB_WITH_$NAME_$DESC_$LPATH,
        [name, description, logoPath],
      );
      const clubIdRec: unknown = clubIdRes.rows[0];
      if (!clubIdRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!ClubIdModel.isValidModel(clubIdRec)) {
        throw new ModelMismatchError(clubIdRec);
      }
      // Associate participant with club
      await pool.query(
        MyClubQueries.ASSOCIATE_PARTICIPANT_WITH_CLUB_WITH_$CID_$PID,
        [(clubIdRec as IClubIdModel).clubId, participantId],
      );
      // Get participant's playerId
      const playerIdRes: QueryResult = await pool.query(
        MyClubQueries.GET_MY_PLID_BY_$PID,
        [participantId],
      );
      const playerIdRec: unknown = playerIdRes.rows[0];
      if (!playerIdRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!PlayerIdModel.isValidModel(playerIdRec)) {
        throw new ModelMismatchError(playerIdRec);
      }
      // Associate participant's player with club
      await pool.query(
        MyClubQueries.ASSOCIATE_PLAYER_WITH_CLUB_WITH_$CID_$PLID,
        [clubIdRec.clubId, (playerIdRec as IPlayerIdModel).playerId],
      );
      // Get MyClubModel
      const myClubRes: QueryResult = await pool.query(
        MyClubQueries.GET_MY_CLUB_MODEL_BY_$PID,
        [participantId],
      );
      const myClubRec: unknown = myClubRes.rows[0];
      if (!myClubRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!MyClubModel.isValidModel(myClubRec)) {
        throw new ModelMismatchError(myClubRec);
      }
      await pool.query("COMMIT");
      // Return MyClubModel
      return myClubRec as IMyClubModel;
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
