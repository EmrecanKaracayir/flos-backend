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
    const refereeRes: QueryResult = await pool.query(
      RefereesQueries.GET_REFEREE_MODELS,
    );
    const refereeRecs: unknown[] = refereeRes.rows;
    if (!refereeRecs) {
      return [];
    }
    if (!RefereeModel.areValidModels(refereeRecs)) {
      throw new ModelMismatchError(refereeRecs);
    }
    return refereeRecs as IRefereeModel[];
  }

  public async getRefereeModelById(
    refereeId: number,
  ): Promise<IRefereeModel | null> {
    const refereeRes: QueryResult = await pool.query(
      RefereesQueries.GET_REFEREE_MODEL_BY_$RID,
      [refereeId],
    );
    const refereeRec: unknown = refereeRes.rows[0];
    if (!refereeRec) {
      return null;
    }
    if (!RefereeModel.isValidModel(refereeRec)) {
      throw new ModelMismatchError(refereeRec);
    }
    return refereeRec as IRefereeModel;
  }
}
