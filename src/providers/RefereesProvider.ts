import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IRefereeModel } from "../interfaces/models/IRefereeModel";
import {
  IRefereesProvider,
  RefereesQueries,
} from "../interfaces/providers/IRefereesProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/common/IServerError";
import { RefereeModel } from "../models/RefereeModel";

export class RefereesProvider implements IRefereesProvider {
  public async getRefereeModels(): Promise<IRefereeModel[]> {
    const result: QueryResult = await pool.query(
      RefereesQueries.GET_REFEREE_MODELS,
    );
    const records: unknown[] = result.rows;
    if (!records) {
      return [];
    }
    if (!RefereeModel.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records as IRefereeModel[];
  }

  public async getRefereeModelById(
    refereeId: number,
  ): Promise<IRefereeModel | null> {
    const result: QueryResult = await pool.query(
      RefereesQueries.GET_REFEREE_MODEL_BY_$RID,
      [refereeId],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      return null;
    }
    if (!RefereeModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IRefereeModel;
  }
}
