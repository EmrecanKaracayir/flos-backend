import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IVenueModel } from "../interfaces/models/IVenueModel";
import {
  IVenuesProvider,
  VenuesQueries,
} from "../interfaces/providers/IVenuesProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/common/IServerError";
import { VenueModel } from "../models/VenueModel";

export class VenuesProvider implements IVenuesProvider {
  public async getVenueModels(): Promise<IVenueModel[]> {
    const result: QueryResult = await pool.query(
      VenuesQueries.GET_VENUE_MODELS,
    );
    const records: unknown[] = result.rows;
    if (!records) {
      return [];
    }
    if (!VenueModel.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records as IVenueModel[];
  }

  public async getVenueModelById(venueId: number): Promise<IVenueModel | null> {
    const result: QueryResult = await pool.query(
      VenuesQueries.GET_VENUE_MODEL_BY_$VID,
      [venueId],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      return null;
    }
    if (!VenueModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IVenueModel;
  }
}
