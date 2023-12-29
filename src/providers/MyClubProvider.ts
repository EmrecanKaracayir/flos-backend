import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { DELETABLE_CLUB_STATES } from "../core/rules/clubRules";
import { AVAILABLE_PLAYER_STATES } from "../core/rules/playerRules";
import { IMyClubModel } from "../interfaces/models/IMyClubModel";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
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
      await pool.query(MyClubQueries.ADD_PLAYER_TO_CLUB_$CLID_$PLID, [
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

  public async isMyClubEditable(participantId: number): Promise<boolean> {
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

  public async getMyClubPlayers(
    participantId: number,
  ): Promise<IPlayerModel[]> {
    const playersRes: QueryResult = await pool.query(
      MyClubQueries.GET_MY_CLUB_PLAYERS_$PRID,
      [participantId],
    );
    const playersRecs: unknown[] = playersRes.rows;
    if (!playersRecs) {
      return [];
    }
    if (!PlayerModel.areValidModels(playersRecs)) {
      throw new ModelMismatchError(playersRecs);
    }
    return playersRecs as IPlayerModel[];
  }

  public async doesPlayerExist(playerId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyClubQueries.DOES_PLAYER_EXIST_$PLID,
      [playerId],
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

  public async isPlayerAvailable(playerId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyClubQueries.IS_PLAYER_IN_STATE_$PLID_$STATES,
      [playerId, AVAILABLE_PLAYER_STATES],
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

  public async addPlayerToMyClub(
    participantId: number,
    playerId: number,
  ): Promise<IPlayerModel> {
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
      // Associate player with club
      await pool.query(MyClubQueries.ADD_PLAYER_TO_CLUB_$CLID_$PLID, [
        clubIdRec.clubId,
        playerId,
      ]);
      // Get player
      const playerRes: QueryResult = await pool.query(
        MyClubQueries.GET_PLAYER_$PLID,
        [playerId],
      );
      const playerRec: unknown = playerRes.rows[0];
      if (!playerRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!PlayerModel.isValidModel(playerRec)) {
        throw new ModelMismatchError(playerRec);
      }
      await pool.query("COMMIT");
      // Return player
      return playerRec as IPlayerModel;
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  public async isPlayerInMyClub(
    participantId: number,
    playerId: number,
  ): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyClubQueries.IS_PLAYER_IN_MY_CLUB_$PRID_$CLID,
      [participantId, playerId],
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

  public async removePlayerFromMyClub(playerId: number): Promise<void> {
    await pool.query("BEGIN");
    try {
      // Disassociate player from club
      await pool.query(MyClubQueries.REMOVE_PLAYER_FROM_CLUB_$PLID, [playerId]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
