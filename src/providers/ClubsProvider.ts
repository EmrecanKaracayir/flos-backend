import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IClubModel } from "../interfaces/models/IClubModel";
import {
  ClubsQueries,
  IClubsProvider,
} from "../interfaces/providers/IClubsProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/common/IServerError";
import { ClubModel } from "../models/ClubModel";

export class ClubsProvider implements IClubsProvider {
  public async getClubModels(): Promise<IClubModel[]> {
    const result: QueryResult = await pool.query(ClubsQueries.GET_CLUB_MODELS);
    const records: unknown[] = result.rows;
    if (!records) {
      return [];
    }
    if (!ClubModel.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records as IClubModel[];
  }

  public async getClubModelById(clubId: number): Promise<IClubModel | null> {
    const result: QueryResult = await pool.query(
      ClubsQueries.GET_CLUB_MODEL_BY_$ID,
      [clubId],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      return null;
    }
    if (!ClubModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IClubModel;
  }
}
