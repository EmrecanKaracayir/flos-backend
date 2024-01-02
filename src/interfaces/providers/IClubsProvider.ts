import { IClubModel } from "../models/IClubModel";
import { IPlayerModel } from "../models/IPlayerModel";

export interface IClubsProvider {
  getClubs: () => Promise<IClubModel[]>;

  getClub: (clubId: number) => Promise<IClubModel | null>;

  getClubPlayers: (clubId: number) => Promise<IPlayerModel[]>;
}

export enum ClubsQueries {
  GET_CLUBS = `SELECT * FROM "ClubView"`,
  GET_CLUB_$CLID = `SELECT * FROM "ClubView" WHERE "clubId" = $1`,
  GET_CLUB_PLAYERS_$CLID = `SELECT * FROM "MyClubPlayerView" WHERE "clubId" = $1`,
}
