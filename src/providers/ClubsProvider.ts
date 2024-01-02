import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { IClubModel } from "../interfaces/models/IClubModel";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import {
  ClubsQueries,
  IClubsProvider,
} from "../interfaces/providers/IClubsProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/app/IServerError";
import { ClubModel } from "../models/ClubModel";
import { PlayerModel } from "../models/PlayerModel";

export class ClubsProvider implements IClubsProvider {
  public async getClubs(): Promise<IClubModel[]> {
    const clubRes: QueryResult = await pool.query(ClubsQueries.GET_CLUBS);
    const clubRecs: unknown[] = clubRes.rows;
    if (!clubRecs) {
      return [];
    }
    if (!ClubModel.areValidModels(clubRecs)) {
      throw new ModelMismatchError(clubRecs);
    }
    return clubRecs as IClubModel[];
  }

  public async getClub(clubId: number): Promise<IClubModel | null> {
    const clubRes: QueryResult = await pool.query(ClubsQueries.GET_CLUB_$CLID, [
      clubId,
    ]);
    const clubRec: unknown = clubRes.rows[0];
    if (!clubRec) {
      return null;
    }
    if (!ClubModel.isValidModel(clubRec)) {
      throw new ModelMismatchError(clubRec);
    }
    return clubRec as IClubModel;
  }

  public async getClubPlayers(clubId: number): Promise<IPlayerModel[]> {
    const playerRes: QueryResult = await pool.query(
      ClubsQueries.GET_CLUB_PLAYERS_$CLID,
      [clubId],
    );
    const playerRecs: unknown[] = playerRes.rows;
    if (!playerRecs) {
      return [];
    }
    if (!PlayerModel.areValidIdModels(playerRecs)) {
      throw new ModelMismatchError(playerRecs);
    }
    return playerRecs as IPlayerModel[];
  }
}
