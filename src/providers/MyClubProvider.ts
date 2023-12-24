import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { DELETABLE_CLUB_STATES } from "../core/rules/clubRules";
import { AVAILABLE_PLAYER_STATES } from "../core/rules/playerRules";
import { IMyClubModel } from "../interfaces/models/IMyClubModel";
import { IClubIdModel } from "../interfaces/models/common/IClubIdModel";
import { IPlayerIdModel } from "../interfaces/models/common/IPlayerIdModel";
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

  public async doesMyClubExist(participantId: number): Promise<boolean> {
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
    return (reRec as IRecordExistsModel).recordExists;
  }

  public async doesMyPlayerExist(participantId: number): Promise<boolean> {
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
    return (reRec as IRecordExistsModel).recordExists;
  }

  public async isMyPlayerAvailable(participantId: number): Promise<boolean> {
    const reRes: QueryResult = await pool.query(
      MyClubQueries.IS_MY_PLAYER_IN_STATE_$PRID_$STATES,
      [participantId, AVAILABLE_PLAYER_STATES],
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

  public async isMyClubDeletable(participantId: number): Promise<boolean> {
    const reRes: QueryResult = await pool.query(
      MyClubQueries.IS_MY_CLUB_IN_STATE_$PRID_$STATES,
      [participantId, DELETABLE_CLUB_STATES],
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
