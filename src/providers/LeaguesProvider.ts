import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { ILeagueModel } from "../interfaces/models/ILeagueModel";
import { IMyLeagueClubModel } from "../interfaces/models/IMyLeagueClubModel";
import {
  ILeaguesProvider,
  LeaguesQueries,
} from "../interfaces/providers/ILeaguesProvider";
import { ModelMismatchError } from "../interfaces/schemas/responses/app/IServerError";
import { LeagueModel } from "../models/LeagueModel";
import { MyLeagueClubModel } from "../models/MyLeagueClubModel";

export class LeaguesProvider implements ILeaguesProvider {
  public async getLeagues(): Promise<ILeagueModel[]> {
    const leagueRes: QueryResult = await pool.query(LeaguesQueries.GET_LEAGUES);
    const leagueRecs: unknown[] = leagueRes.rows;
    if (!leagueRecs) {
      return [];
    }
    if (!LeagueModel.areValidModels(leagueRecs)) {
      throw new ModelMismatchError(leagueRecs);
    }
    return leagueRecs as ILeagueModel[];
  }

  public async getLeague(leagueId: number): Promise<ILeagueModel | null> {
    const leagueRes: QueryResult = await pool.query(
      LeaguesQueries.GET_LEAGUE_$LGID,
      [leagueId],
    );
    const leagueRec: unknown = leagueRes.rows[0];
    if (!leagueRec) {
      return null;
    }
    if (!LeagueModel.isValidModel(leagueRec)) {
      throw new ModelMismatchError(leagueRec);
    }
    return leagueRec as ILeagueModel;
  }

  public async getLeagueClubs(leagueId: number): Promise<IMyLeagueClubModel[]> {
    const clubRes: QueryResult = await pool.query(
      LeaguesQueries.GET_LEAGUE_CLUBS_$LGID,
      [leagueId],
    );
    const clubRecs: unknown[] = clubRes.rows;
    if (!clubRecs) {
      return [];
    }
    if (!MyLeagueClubModel.areValidModels(clubRecs)) {
      throw new ModelMismatchError(clubRecs);
    }
    return clubRecs as IMyLeagueClubModel[];
  }
}
