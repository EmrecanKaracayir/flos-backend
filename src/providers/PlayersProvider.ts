import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import {
  IPlayersProvider,
  PlayersQueries,
} from "../interfaces/providers/IPlayersProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/app/IServerError";
import { PlayerModel } from "../models/PlayerModel";

export class PlayersProvider implements IPlayersProvider {
  public async getPlayers(): Promise<IPlayerModel[]> {
    const playerRes: QueryResult = await pool.query(PlayersQueries.GET_PLAYERS);
    const playerRecs: unknown[] = playerRes.rows;
    if (!playerRecs) {
      return [];
    }
    if (!PlayerModel.areValidModels(playerRecs)) {
      throw new ModelMismatchError(playerRecs);
    }
    return playerRecs as IPlayerModel[];
  }

  public async getPlayer(playerId: number): Promise<IPlayerModel | null> {
    const playerRes: QueryResult = await pool.query(
      PlayersQueries.GET_PLAYER_$PLID,
      [playerId],
    );
    const playerRec: unknown = playerRes.rows[0];
    if (!playerRec) {
      return null;
    }
    if (!PlayerModel.isValidModel(playerRec)) {
      throw new ModelMismatchError(playerRec);
    }
    return playerRec as IPlayerModel;
  }
}
