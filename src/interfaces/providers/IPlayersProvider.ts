import { IPlayerModel } from "../models/IPlayerModel";

export interface IPlayersProvider {
  getPlayerModels: () => Promise<IPlayerModel[]>;

  getPlayerModelById: (playerId: number) => Promise<IPlayerModel | null>;
}

export enum PlayersQueries {
  GET_PLAYER_MODELS = `SELECT * FROM "PlayerView"`,
  GET_PLAYER_MODEL_BY_$PLID = `${GET_PLAYER_MODELS} WHERE "playerId" = $1`,
}
