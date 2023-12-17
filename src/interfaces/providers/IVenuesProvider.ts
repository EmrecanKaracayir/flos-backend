import { IVenueModel } from "../models/IVenueModel";

export interface IVenuesProvider {
  getVenueModels: () => Promise<IVenueModel[]>;

  getVenueModelById: (venueId: number) => Promise<IVenueModel | null>;
}

export enum VenuesQueries {
  GET_VENUE_MODELS = `SELECT * FROM "Venue"`,
  GET_VENUE_MODEL_BY_$ID = `SELECT * FROM "Venue" WHERE "venueId" = $1`,
}
