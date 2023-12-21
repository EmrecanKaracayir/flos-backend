import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IMyLeagueModel } from "../interfaces/models/IMyLeagueModel";
import {
  IMyLeaguesProvider,
  MyLeaguesQueries,
} from "../interfaces/providers/IMyLeaguesProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/common/IServerError";
import { LeagueIdModel } from "../models/LeagueIdModel";
import { MyLeagueModel } from "../models/MyLeagueModel";

export class MyLeaguesProvider implements IMyLeaguesProvider {
  public async getMyLeagueModels(
    organizerId: number,
  ): Promise<IMyLeagueModel[]> {
    const result: QueryResult = await pool.query(
      MyLeaguesQueries.GET_MY_LEAGUE_MODELS_BY_$ID,
      [organizerId],
    );
    const records: unknown[] = result.rows;
    if (!records) {
      return [];
    }
    if (!MyLeagueModel.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records as IMyLeagueModel[];
  }

  public async createLeague(
    organizerId: number,
    name: string,
    prize: number,
    description: string,
    logoPath: string,
  ): Promise<IMyLeagueModel> {
    const firstResult: QueryResult = await pool.query(
      MyLeaguesQueries.CREATE_LEAGUE_WITH_$OID_$NAME_$PRIZE_$DESC_$LOGO_PATH,
      [organizerId, name, prize, description, logoPath],
    );
    const firstRecord: unknown = firstResult.rows[0];
    if (!firstRecord) {
      throw new UnexpectedQueryResultError();
    }
    if (!LeagueIdModel.isValidModel(firstRecord)) {
      throw new ModelMismatchError(firstRecord);
    }
    const secondResult: QueryResult = await pool.query(
      MyLeaguesQueries.GET_MY_LEAGUE_MODEL_BY_$OID_$LID,
      [organizerId, firstRecord.leagueId],
    );
    const secondRecord: unknown = secondResult.rows[0];
    if (!secondRecord) {
      throw new UnexpectedQueryResultError();
    }
    if (!MyLeagueModel.isValidModel(secondRecord)) {
      throw new ModelMismatchError(secondRecord);
    }
    return secondRecord as IMyLeagueModel;
  }

  public async getMyLeagueModelById(
    organizerId: number,
    leagueId: number,
  ): Promise<IMyLeagueModel | null> {
    const result: QueryResult = await pool.query(
      MyLeaguesQueries.GET_MY_LEAGUE_MODEL_BY_$OID_$LID,
      [organizerId, leagueId],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      return null;
    }
    if (!MyLeagueModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IMyLeagueModel;
  }
}
