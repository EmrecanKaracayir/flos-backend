import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { DELETABLE_CLUB_STATES } from "../core/rules/clubRules";
import { AVAILABLE_PLAYER_STATES } from "../core/rules/playerRules";
import { IMyClubModel } from "../interfaces/models/IMyClubModel";
import { IExistsModel } from "../interfaces/models/util/IExistsModel";
import {
  IMyClubProvider,
  MyClubQueries,
} from "../interfaces/providers/IMyClubProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/app/IServerError";
import { ClubModel } from "../models/ClubModel";
import { MyClubModel } from "../models/MyClubModel";
import { PlayerModel } from "../models/PlayerModel";
import { ExistsModel } from "../models/util/ExistsModel";

export class MyClubProvider implements IMyClubProvider {
  public async getMyClub(participantId: number): Promise<IMyClubModel | null> {
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
    const existsRes: QueryResult = await pool.query(
      MyClubQueries.DOES_MY_CLUB_EXIST_$PRID,
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

  public async doesMyPlayerExist(participantId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyClubQueries.DOES_MY_PLAYER_EXIST_$PRID,
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

  public async isMyPlayerAvailable(participantId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyClubQueries.IS_MY_PLAYER_IN_STATE_$PRID_$STATES,
      [participantId, AVAILABLE_PLAYER_STATES],
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
      if (!ClubModel.isValidIdModel(clubIdRec)) {
        throw new ModelMismatchError(clubIdRec);
      }
      // Associate participant with club
      await pool.query(MyClubQueries.SET_CLID_IN_PARTICIPANT_$CLID_$PRID, [
        clubIdRec.clubId,
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
      if (!PlayerModel.isValidIdModel(playerIdRec)) {
        throw new ModelMismatchError(playerIdRec);
      }
      // Associate participant's player with club
      await pool.query(MyClubQueries.SET_CLID_IN_PLAYER_$CLID_$PLID, [
        clubIdRec.clubId,
        playerIdRec.playerId,
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
      if (!ClubModel.isValidIdModel(clubIdRec)) {
        throw new ModelMismatchError(clubIdRec);
      }
      // Update club
      await pool.query(MyClubQueries.UPDATE_CLUB_$CLID_$NAME_$DESC_$LPATH, [
        clubIdRec.clubId,
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
    const existsRes: QueryResult = await pool.query(
      MyClubQueries.IS_MY_CLUB_IN_STATE_$PRID_$STATES,
      [participantId, DELETABLE_CLUB_STATES],
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
      if (!ClubModel.isValidIdModel(clubIdRec)) {
        throw new ModelMismatchError(clubIdRec);
      }
      // Free club from participant
      await pool.query(MyClubQueries.FREE_CLUB_FROM_PARTICIPANT_$PRID, [
        participantId,
      ]);
      // Free club from players
      await pool.query(MyClubQueries.FREE_CLUB_FROM_PLAYERS_$CLID, [
        clubIdRec.clubId,
      ]);
      // Delete club
      await pool.query(MyClubQueries.DELETE_CLUB_$CLID, [clubIdRec.clubId]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
