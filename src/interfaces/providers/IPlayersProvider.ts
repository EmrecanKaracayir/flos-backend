import { IPlayerModel } from "../models/IPlayerModel";

export interface IPlayersProvider {
  getPlayerModels: () => Promise<IPlayerModel[]>;

  getPlayerModelById: (playerId: number) => Promise<IPlayerModel | null>;
}

export enum PlayersQueries {
  GET_PLAYERS = `SELECT * FROM "PlayerView"`,
  GET_PLAYER_$PLID = `SELECT * FROM "PlayerView" WHERE "playerId" = $1`,
}
