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
    const clubRes: QueryResult = await pool.query(ClubsQueries.GET_CLUB_MODELS);
    const clubRecs: unknown[] = clubRes.rows;
    if (!clubRecs) {
      return [];
    }
    if (!ClubModel.areValidModels(clubRecs)) {
      throw new ModelMismatchError(clubRecs);
    }
    return clubRecs as IClubModel[];
  }

  public async getClubModelById(clubId: number): Promise<IClubModel | null> {
    const clubRes: QueryResult = await pool.query(
      ClubsQueries.GET_CLUB_MODEL_BY_$CID,
      [clubId],
    );
    const clubRec: unknown = clubRes.rows[0];
    if (!clubRec) {
      return null;
    }
    if (!ClubModel.isValidModel(clubRec)) {
      throw new ModelMismatchError(clubRec);
    }
    return clubRec as IClubModel;
  }
}
