import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import {
  IPlayersProvider,
  PlayersQueries,
} from "../interfaces/providers/IPlayersProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/common/IServerError";
import { PlayerModel } from "../models/PlayerModel";

export class PlayersProvider implements IPlayersProvider {
  public async getPlayerModels(): Promise<IPlayerModel[]> {
    const result: QueryResult = await pool.query(
      PlayersQueries.GET_PLAYER_MODELS,
    );
    const records: unknown[] = result.rows;
    if (!records) {
      return [];
    }
    if (!PlayerModel.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records as IPlayerModel[];
  }

  public async getPlayerModelById(
    playerId: number,
  ): Promise<IPlayerModel | null> {
    const result: QueryResult = await pool.query(
      PlayersQueries.GET_PLAYER_MODEL_BY_$ID,
      [playerId],
    );
    const record: unknown = result.rows[0];
    if (!record) {
      return null;
    }
    if (!PlayerModel.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return record as IPlayerModel;
  }
}
