import { IClubModel } from "../models/IClubModel";

export interface IClubsProvider {
  getClubs: () => Promise<IClubModel[]>;

  getClub: (clubId: number) => Promise<IClubModel | null>;
}

export enum ClubsQueries {
  GET_CLUBS = `SELECT * FROM "ClubView"`,
  GET_CLUB_$CLID = `SELECT * FROM "ClubView" WHERE "clubId" = $1`,
}
