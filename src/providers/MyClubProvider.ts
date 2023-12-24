import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { ClubState } from "../core/enums/clubState";
import { PlayerState } from "../core/enums/playerState";
import { IMyClubModel } from "../interfaces/models/IMyClubModel";
import { IClubIdModel } from "../interfaces/models/common/IClubIdModel";
import { IClubStateModel } from "../interfaces/models/common/IClubStateModel";
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
import { ClubStateModel } from "../models/common/ClubStateModel";
import { PlayerIdModel } from "../models/common/PlayerIdModel";
import { PlayerStateModel } from "../models/common/PlayerStateModel";
import { RecordExistsModel } from "../models/common/RecordExistsModel";

export class MyClubProvider implements IMyClubProvider {
  public async getMyClubModel(
    participantId: number,
  ): Promise<IMyClubModel | null> {
    const myClubRes: QueryResult = await pool.query(
      MyClubQueries.GET_MY_CLUB_$PRID,
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
      MyClubQueries.DOES_MY_CLUB_EXIST_$PRID,
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
      MyClubQueries.DOES_MY_PLAYER_EXIST_$PRID,
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

  public async doesMyPlayerInState(
    participantId: number,
    allowedPlayerStates: PlayerState[],
  ): Promise<boolean> {
    const playerStateRes: QueryResult = await pool.query(
      MyClubQueries.GET_MY_PLAYER_STATE_$PRID,
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
        MyClubQueries.CREATE_CLUB_$NAME_$DESC_$LPATH,
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
      await pool.query(MyClubQueries.SET_CLID_IN_PARTICIPANT_$CLID_$PRID, [
        (clubIdRec as IClubIdModel).clubId,
        participantId,
      ]);
      // Get participant's playerId
      const playerIdRes: QueryResult = await pool.query(
        MyClubQueries.GET_MY_PLID_$PRID,
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
      await pool.query(MyClubQueries.SET_CLID_IN_PLAYER_$CLID_$PLID, [
        clubIdRec.clubId,
        (playerIdRec as IPlayerIdModel).playerId,
      ]);
      // Get MyClubModel
      const myClubRes: QueryResult = await pool.query(
        MyClubQueries.GET_MY_CLUB_$PRID,
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

  public async updateMyClub(
    participantId: number,
    name: string,
    description: string,
    logoPath: string,
  ): Promise<IMyClubModel> {
    await pool.query("BEGIN");
    try {
      // Get clubId from participant
      const clubIdRes: QueryResult = await pool.query(
        MyClubQueries.GET_MY_CLID_$PRID,
        [participantId],
      );
      const clubIdRec: unknown = clubIdRes.rows[0];
      if (!clubIdRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!ClubIdModel.isValidModel(clubIdRec)) {
        throw new ModelMismatchError(clubIdRec);
      }
      // Update club
      await pool.query(MyClubQueries.UPDATE_CLUB_$CLID_$NAME_$DESC_$LPATH, [
        (clubIdRec as IClubIdModel).clubId,
        name,
        description,
        logoPath,
      ]);
      // Get MyClubModel
      const myClubRes: QueryResult = await pool.query(
        MyClubQueries.GET_MY_CLUB_$PRID,
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
      // Return MyPlayerModel
      return myClubRec as IMyClubModel;
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  public async doesMyClubInState(
    participantId: number,
    allowedClubStates: ClubState[],
  ): Promise<boolean> {
    const clubStateRes: QueryResult = await pool.query(
      MyClubQueries.GET_MY_CLUB_STATE_$PRID,
      [participantId],
    );
    const clubStateRec: unknown = clubStateRes.rows[0];
    if (!clubStateRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ClubStateModel.isValidModel(clubStateRec)) {
      throw new ModelMismatchError(clubStateRec);
    }
    return allowedClubStates.includes((clubStateRec as IClubStateModel).state);
  }

  public async deleteMyClub(participantId: number): Promise<void> {
    await pool.query("BEGIN");
    try {
      // Get clubId from participant
      const clubIdRes: QueryResult = await pool.query(
        MyClubQueries.GET_MY_CLID_$PRID,
        [participantId],
      );
      const clubIdRec: unknown = clubIdRes.rows[0];
      if (!clubIdRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!ClubIdModel.isValidModel(clubIdRec)) {
        throw new ModelMismatchError(clubIdRec);
      }
      // Free club from participant
      await pool.query(MyClubQueries.FREE_CLUB_FROM_PARTICIPANT_$PRID, [
        participantId,
      ]);
      // Free club from players
      await pool.query(MyClubQueries.FREE_CLUB_FROM_PLAYERS_$CLID, [
        (clubIdRec as IClubIdModel).clubId,
      ]);
      // Delete club
      await pool.query(MyClubQueries.DELETE_CLUB_$CLID, [
        (clubIdRec as IClubIdModel).clubId,
      ]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
