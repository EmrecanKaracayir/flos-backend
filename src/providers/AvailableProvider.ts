import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { AVAILABLE_CLUB_STATES } from "../core/rules/clubRules";
import { AVAILABLE_LEAGUE_STATES } from "../core/rules/leagueRules";
import { AVAILABLE_PLAYER_STATES } from "../core/rules/playerRules";
import { IClubModel } from "../interfaces/models/IClubModel";
import { ILeagueModel } from "../interfaces/models/ILeagueModel";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import {
  AvailableQueries,
  IAvailableProvider,
} from "../interfaces/providers/IAvailableProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/app/IServerError";
import { ClubModel } from "../models/ClubModel";
import { LeagueModel } from "../models/LeagueModel";
import { PlayerModel } from "../models/PlayerModel";

export class AvailableProvider implements IAvailableProvider {
  public async getAvailableClubs(): Promise<IClubModel[]> {
    const clubRes: QueryResult = await pool.query(
      AvailableQueries.GET_AVAILABLE_CLUBS_$STATES,
      [AVAILABLE_CLUB_STATES],
    );
    const clubRecs: unknown[] = clubRes.rows;
    if (!clubRecs) {
      return [];
    }
    if (!ClubModel.areValidModels(clubRecs)) {
      throw new ModelMismatchError(clubRecs);
    }
    return clubRecs as IClubModel[];
  }

  public async getAvailableLeagues(): Promise<ILeagueModel[]> {
    const leagueRes: QueryResult = await pool.query(
      AvailableQueries.GET_AVAILABLE_LEAGUES_$STATES,
      [AVAILABLE_LEAGUE_STATES],
    );
    const leagueRecs: unknown[] = leagueRes.rows;
    if (!leagueRecs) {
      return [];
    }
    if (!LeagueModel.areValidModels(leagueRecs)) {
      throw new ModelMismatchError(leagueRecs);
    }
    return leagueRecs as ILeagueModel[];
  }

  public async getAvailablePlayers(): Promise<IPlayerModel[]> {
    const playerRes: QueryResult = await pool.query(
      AvailableQueries.GET_AVAILABLE_PLAYERS_$STATES,
      [AVAILABLE_PLAYER_STATES],
    );
    const playerRec: unknown[] = playerRes.rows;
    if (!playerRec) {
      return [];
    }
    if (!PlayerModel.areValidModels(playerRec)) {
      throw new ModelMismatchError(playerRec);
    }
    return playerRec as IPlayerModel[];
  }
}
