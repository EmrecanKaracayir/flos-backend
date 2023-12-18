import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { ILeagueModel } from "../interfaces/models/ILeagueModel";
import {
  ILeaguesProvider,
  LeaguesQueries,
} from "../interfaces/providers/ILeaguesProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/common/IServerError";
import { LeagueModel } from "../models/LeagueModel";

export class LeaguesProvider implements ILeaguesProvider {
  public async getLeagueModels(): Promise<ILeagueModel[]> {
    const result: QueryResult = await pool.query(
      LeaguesQueries.GET_LEAGUE_MODELS,
    );
    const records: unknown[] = result.rows;
    if (!records) {
      return [];
    }
    if (!LeagueModel.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records as ILeagueModel[];
  }

  public async getLeagueModelById(
    leagueId: number,
  ): Promise<ILeagueModel | null> {
    const result: QueryResult = await pool.query(
      LeaguesQueries.GET_LEAGUE_MODEL_BY_$ID,
      [leagueId],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      return null;
    }
    if (!LeagueModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as ILeagueModel;
  }
}
