import { IClubModel } from "../models/IClubModel";

export interface IClubsProvider {
  getClubModels: () => Promise<IClubModel[]>;

  getClubModelById: (clubId: number) => Promise<IClubModel | null>;
}

export enum ClubsQueries {
  GET_CLUB_MODELS = `SELECT * FROM "ClubView"`,
  GET_CLUB_MODEL_BY_$CID = `${GET_CLUB_MODELS} WHERE "clubId" = $1`,
}
