import { IVenueModel } from "../models/IVenueModel";

export interface IVenuesProvider {
  getVenueModels: () => Promise<IVenueModel[]>;

  getVenueModelById: (venueId: number) => Promise<IVenueModel | null>;
}

export enum VenuesQueries {
  GET_VENUES = `SELECT * FROM "VenueView"`,
  GET_VENUE_$VNID = `SELECT * FROM "VenueView" WHERE "venueId" = $1`,
}
