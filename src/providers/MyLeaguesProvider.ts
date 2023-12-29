import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import {
  AVAILABLE_CLUB_STATES,
  DELETABLE_CLUB_STATES,
} from "../core/rules/clubRules";
import { EDITABLE_LEAGUE_STATES } from "../core/rules/leagueRules";
import { IClubModel } from "../interfaces/models/IClubModel";
import { IMyLeagueModel } from "../interfaces/models/IMyLeagueModel";
import { IExistsModel } from "../interfaces/models/util/IExistsModel";
import {
  IMyLeaguesProvider,
  MyLeaguesQueries,
} from "../interfaces/providers/IMyLeaguesProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/app/IServerError";
import { ClubModel } from "../models/ClubModel";
import { LeagueModel } from "../models/LeagueModel";
import { MyLeagueModel } from "../models/MyLeagueModel";
import { ExistsModel } from "../models/util/ExistsModel";

export class MyLeaguesProvider implements IMyLeaguesProvider {
  public async getMyLeagues(organizerId: number): Promise<IMyLeagueModel[]> {
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

  public async createMyLeague(
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
      if (!LeagueModel.isValidIdModel(leagueIdRec)) {
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

  public async getMyLeague(
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

  public async doesMyLeagueExist(
    organizerId: number,
    leagueId: number,
  ): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyLeaguesQueries.DOES_MY_LEAGUE_EXIST_$ORID_$LGID,
      [organizerId, leagueId],
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

  public async isMyLeagueEditable(leagueId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyLeaguesQueries.IS_MY_LEAGUE_IN_STATE_$PRID_$STATES,
      [leagueId, EDITABLE_LEAGUE_STATES],
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

  public async updateMyLeague(
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

  public async isMyLeagueDeletable(leagueId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyLeaguesQueries.IS_MY_LEAGUE_IN_STATE_$PRID_$STATES,
      [leagueId, DELETABLE_CLUB_STATES],
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

  public async deleteMyLeague(leagueId: number): Promise<void> {
    await pool.query("BEGIN");
    try {
      // Free clubs from league
      await pool.query(MyLeaguesQueries.FREE_LEAGUE_FROM_CLUBS_$LGID, [
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

  public async getMyLeagueClubs(leagueId: number): Promise<IClubModel[]> {
    const clubsRes: QueryResult = await pool.query(
      MyLeaguesQueries.GET_MY_LEAGUE_CLUBS_$LGID,
      [leagueId],
    );
    const clubsRecs: unknown[] = clubsRes.rows;
    if (!clubsRecs) {
      return [];
    }
    if (!ClubModel.areValidModels(clubsRecs)) {
      throw new ModelMismatchError(clubsRecs);
    }
    return clubsRecs as IClubModel[];
  }

  public async doesClubExist(clubId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyLeaguesQueries.DOES_CLUB_EXIST_$CLID,
      [clubId],
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

  public async isClubAvailable(clubId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyLeaguesQueries.IS_CLUB_IN_STATE_$CLID_$STATES,
      [clubId, AVAILABLE_CLUB_STATES],
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

  public async addClubToMyLeague(
    leagueId: number,
    clubId: number,
  ): Promise<IClubModel> {
    await pool.query("BEGIN");
    try {
      // Add club to league
      await pool.query(MyLeaguesQueries.ADD_CLUB_TO_LEAGUE_$LGID_$CLID, [
        leagueId,
        clubId,
      ]);
      // Get ClubModel by clubId
      const clubRes: QueryResult = await pool.query(
        MyLeaguesQueries.GET_CLUB_$CLID,
        [clubId],
      );
      const clubRec: unknown = clubRes.rows[0];
      if (!clubRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!ClubModel.isValidModel(clubRec)) {
        throw new ModelMismatchError(clubRec);
      }
      await pool.query("COMMIT");
      // Return ClubModel
      return clubRec as IClubModel;
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  public async isClubInLeague(
    leagueId: number,
    clubId: number,
  ): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyLeaguesQueries.IS_CLUB_IN_LEAGUE_$CLID_$LGID,
      [clubId, leagueId],
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

  public async removeClubFromMyLeague(clubId: number): Promise<void> {
    await pool.query("BEGIN");
    try {
      // Remove club from league
      await pool.query(MyLeaguesQueries.REMOVE_CLUB_FROM_LEAGUE_$CLID, [
        clubId,
      ]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
