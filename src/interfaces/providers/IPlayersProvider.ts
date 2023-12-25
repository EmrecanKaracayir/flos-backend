import { IPlayerModel } from "../models/IPlayerModel";

export interface IPlayersProvider {
  getPlayers: () => Promise<IPlayerModel[]>;

  getPlayer: (playerId: number) => Promise<IPlayerModel | null>;
}

export enum PlayersQueries {
  GET_PLAYERS = `SELECT * FROM "PlayerView"`,
  GET_PLAYER_$PLID = `SELECT * FROM "PlayerView" WHERE "playerId" = $1`,
}
