import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IVenueModel } from "../interfaces/models/IVenueModel";
import {
  IVenuesProvider,
  VenuesQueries,
} from "../interfaces/providers/IVenuesProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/app/IServerError";
import { VenueModel } from "../models/VenueModel";

export class VenuesProvider implements IVenuesProvider {
  public async getVenues(): Promise<IVenueModel[]> {
    const venueRes: QueryResult = await pool.query(VenuesQueries.GET_VENUES);
    const venueRecs: unknown[] = venueRes.rows;
    if (!venueRecs) {
      return [];
    }
    if (!VenueModel.areValidModels(venueRecs)) {
      throw new ModelMismatchError(venueRecs);
    }
    return venueRecs as IVenueModel[];
  }

  public async getVenue(venueId: number): Promise<IVenueModel | null> {
    const venueRes: QueryResult = await pool.query(
      VenuesQueries.GET_VENUE_$VNID,
      [venueId],
    );
    const venueRec: unknown = venueRes.rows[0];
    if (!venueRec) {
      return null;
    }
    if (!VenueModel.isValidModel(venueRec)) {
      throw new ModelMismatchError(venueRec);
    }
    return venueRec as IVenueModel;
  }
}
