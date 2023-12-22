import { IVenueModel } from "../models/IVenueModel";

export interface IVenuesProvider {
  getVenueModels: () => Promise<IVenueModel[]>;

  getVenueModelById: (venueId: number) => Promise<IVenueModel | null>;
}

export enum VenuesQueries {
  GET_VENUE_MODELS = `SELECT * FROM "VenueView"`,
  GET_VENUE_MODEL_BY_$VID = `${GET_VENUE_MODELS} WHERE "venueId" = $1`,
}
