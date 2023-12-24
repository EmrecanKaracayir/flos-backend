import { IClubModel } from "../models/IClubModel";
import { ILeagueModel } from "../models/ILeagueModel";
import { IPlayerModel } from "../models/IPlayerModel";

export interface IAvailableProvider {
  getAvailableClubModels: () => Promise<IClubModel[]>;

  getAvailableLeagueModels: () => Promise<ILeagueModel[]>;

  getAvailablePlayerModels: () => Promise<IPlayerModel[]>;
}

export enum AvailableQueries {
  GET_AVAILABLE_CLUBS_$STATES = `SELECT * FROM "ClubView" WHERE state = ANY($1::"ClubState"[])`,
  GET_AVAILABLE_LEAGUES_$STATES = `SELECT * FROM "LeagueView" WHERE state = ANY($1::"LeagueState"[])`,
  GET_AVAILABLE_PLAYERS_$STATES = `SELECT * FROM "PlayerView" WHERE state = ANY($1::"PlayerState"[])`,
}
