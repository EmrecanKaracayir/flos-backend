import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { LeagueState } from "../core/enums/leagueState";
import { IMyLeagueModel } from "../interfaces/models/IMyLeagueModel";
import { ILeagueStateModel } from "../interfaces/models/common/ILeagueStateModel";
import { IRecordExistsModel } from "../interfaces/models/common/IRecordExistsModel";
import {
  IMyLeaguesProvider,
  MyLeaguesQueries,
} from "../interfaces/providers/IMyLeaguesProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/common/IServerError";
import { MyLeagueModel } from "../models/MyLeagueModel";
import { LeagueIdModel } from "../models/common/LeagueIdModel";
import { LeagueStateModel } from "../models/common/LeagueStateModel";
import { RecordExistsModel } from "../models/common/RecordExistsModel";

export class MyLeaguesProvider implements IMyLeaguesProvider {
  public async getMyLeagueModels(
    organizerId: number,
  ): Promise<IMyLeagueModel[]> {
    const myLeagueRes: QueryResult = await pool.query(
      MyLeaguesQueries.GET_MY_LEAGUES_$ORID,
      [organizerId],
    );
    const myLeagueRecs: unknown[] = myLeagueRes.rows;
    if (!myLeagueRecs) {
      return [];
    }
    if (!MyLeagueModel.areValidModels(myLeagueRecs)) {
      throw new ModelMismatchError(myLeagueRecs);
    }
    return myLeagueRecs as IMyLeagueModel[];
  }

  public async createLeague(
    organizerId: number,
    name: string,
    prize: number,
    description: string,
    logoPath: string,
  ): Promise<IMyLeagueModel> {
    await pool.query("BEGIN");
    try {
      // Create league and return its leagueId
      const leagueIdRes: QueryResult = await pool.query(
        MyLeaguesQueries.CREATE_LEAGUE_$OID_$NAME_$PRIZE_$DESC_$LPATH,
        [organizerId, name, prize, description, logoPath],
      );
      const leagueIdRec: unknown = leagueIdRes.rows[0];
      if (!leagueIdRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!LeagueIdModel.isValidModel(leagueIdRec)) {
        throw new ModelMismatchError(leagueIdRec);
      }
      // Get MyLeagueModel by leagueId
      const myLeagueRes: QueryResult = await pool.query(
        MyLeaguesQueries.GET_MY_LEAGUE_$ORID_$LGID,
        [organizerId, leagueIdRec.leagueId],
      );
      const myLeagueRec: unknown = myLeagueRes.rows[0];
      if (!myLeagueRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!MyLeagueModel.isValidModel(myLeagueRec)) {
        throw new ModelMismatchError(myLeagueRec);
      }
      await pool.query("COMMIT");
      // Return MyLeagueModel
      return myLeagueRec as IMyLeagueModel;
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  public async getMyLeagueModelById(
    organizerId: number,
    leagueId: number,
  ): Promise<IMyLeagueModel | null> {
    const myLeagueRes: QueryResult = await pool.query(
      MyLeaguesQueries.GET_MY_LEAGUE_$ORID_$LGID,
      [organizerId, leagueId],
    );
    const myLeagueRec: unknown = myLeagueRes.rows[0];
    if (!myLeagueRec) {
      return null;
    }
    if (!MyLeagueModel.isValidModel(myLeagueRec)) {
      throw new ModelMismatchError(myLeagueRec);
    }
    return myLeagueRec as IMyLeagueModel;
  }

  public async doesMyLeagueExistById(
    organizerId: number,
    leagueId: number,
  ): Promise<IRecordExistsModel> {
    const reRes: QueryResult = await pool.query(
      MyLeaguesQueries.DOES_MY_LEAGUE_EXIST_$ORID_$LGID,
      [organizerId, leagueId],
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

  public async doesLeagueByIdInStates(
    leagueId: number,
    allowedLeagueStates: LeagueState[],
  ): Promise<boolean> {
    const leagueStateRes: QueryResult = await pool.query(
      MyLeaguesQueries.GET_LEAGUE_STATE_$LGID,
      [leagueId],
    );
    const leagueStateRec: unknown = leagueStateRes.rows[0];
    if (!leagueStateRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!LeagueStateModel.isValidModel(leagueStateRec)) {
      throw new ModelMismatchError(leagueStateRec);
    }
    return allowedLeagueStates.includes(
      (leagueStateRec as ILeagueStateModel).state,
    );
  }

  public async updateLeague(
    organizerId: number,
    leagueId: number,
    name: string,
    prize: number,
    description: string,
    logoPath: string,
  ): Promise<IMyLeagueModel> {
    await pool.query("BEGIN");
    try {
      // Edit league
      await pool.query(
        MyLeaguesQueries.UPDATE_LEAGUE_$LGID_$NAME_$PRIZE_$DESC_$LPATH,
        [leagueId, name, prize, description, logoPath],
      );
      // Get MyLeagueModel by leagueId
      const myLeagueRes: QueryResult = await pool.query(
        MyLeaguesQueries.GET_MY_LEAGUE_$ORID_$LGID,
        [organizerId, leagueId],
      );
      const myLeagueRec: unknown = myLeagueRes.rows[0];
      if (!myLeagueRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!MyLeagueModel.isValidModel(myLeagueRec)) {
        throw new ModelMismatchError(myLeagueRec);
      }
      await pool.query("COMMIT");
      // Return MyLeagueModel
      return myLeagueRec as IMyLeagueModel;
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  public async deleteLeague(leagueId: number): Promise<void> {
    await pool.query("BEGIN");
    try {
      // Free clubs from league
      await pool.query(MyLeaguesQueries.FREE_CLUBS_FROM_LEAGUE_$LGID, [
        leagueId,
      ]);
      // Delete league
      await pool.query(MyLeaguesQueries.DELETE_LEAGUE_$LGID, [leagueId]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
