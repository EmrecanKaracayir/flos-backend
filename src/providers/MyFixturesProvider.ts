import { QueryResult } from "pg";
import { pool } from "../core/database/pool";
import { LeagueState } from "../core/enums/leagueState";
import { AVAILABLE_FIXTURE_STATES } from "../core/rules/fixtureRules";
import { IMyClubPlayerModel } from "../interfaces/models/IMyClubPlayerModel";
import { IMyFixtureModel } from "../interfaces/models/IMyFixtureModel";
import { IExistsModel } from "../interfaces/models/util/IExistsModel";
import {
  IMyFixturesProvider,
  MyFixturesQueries,
} from "../interfaces/providers/IMyFixturesProvider";
import {
  ModelMismatchError,
  UnexpectedQueryResultError,
} from "../interfaces/schemas/responses/app/IServerError";
import { ClubModel } from "../models/ClubModel";
import { MyClubPlayerModel } from "../models/MyClubPlayerModel";
import { MyFixtureModel } from "../models/MyFixtureModel";
import { ExistsModel } from "../models/util/ExistsModel";

export class MyFixturesProvider implements IMyFixturesProvider {
  public async getMyFixtures(organizerId: number): Promise<IMyFixtureModel[]> {
    const myFixturesRes: QueryResult = await pool.query(
      MyFixturesQueries.GET_MY_FIXTURES_$ORID_$STATE,
      [organizerId, AVAILABLE_FIXTURE_STATES],
    );
    const myFixturesRecs: unknown[] = myFixturesRes.rows;
    if (!myFixturesRecs) {
      return [];
    }
    if (!MyFixtureModel.areValidModels(myFixturesRecs)) {
      throw new ModelMismatchError(myFixturesRecs);
    }
    return myFixturesRecs as IMyFixtureModel[];
  }

  public async getMyFixture(
    organizerId: number,
    fixtureId: number,
  ): Promise<IMyFixtureModel | null> {
    const myFixtureRes: QueryResult = await pool.query(
      MyFixturesQueries.GET_MY_FIXTURE_$ORID_$FXID,
      [organizerId, fixtureId],
    );
    const myFixtureRec: unknown = myFixtureRes.rows[0];
    if (!myFixtureRec) {
      return null;
    }
    if (!MyFixtureModel.isValidModel(myFixtureRec)) {
      throw new ModelMismatchError(myFixtureRec);
    }
    return myFixtureRec as IMyFixtureModel;
  }

  public async doesMyFixtureExist(
    organizerId: number,
    fixtureId: number,
  ): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyFixturesQueries.DOES_MY_FIXTURE_EXIST_$ORID_$FXID,
      [organizerId, fixtureId],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return (existsRec as IExistsModel).exists;
  }

  public async isMyFixtureAvailable(fixtureId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyFixturesQueries.IS_FIXTURE_IN_STATE_$FXID_$STATES,
      [fixtureId, AVAILABLE_FIXTURE_STATES],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return (existsRec as IExistsModel).exists;
  }

  public async getMyClubPlayers(clubId: number): Promise<IMyClubPlayerModel[]> {
    const myClubPlayersRes: QueryResult = await pool.query(
      MyFixturesQueries.GET_MY_CLUB_PLAYERS_$CLID,
      [clubId],
    );
    const myClubPlayersRecs: unknown[] = myClubPlayersRes.rows;
    if (!myClubPlayersRecs) {
      return [];
    }
    if (!MyClubPlayerModel.areValidModels(myClubPlayersRecs)) {
      throw new ModelMismatchError(myClubPlayersRecs);
    }
    return myClubPlayersRecs as IMyClubPlayerModel[];
  }

  public async updateFixture(
    fixtureId: number,
    homeScore: number,
    awayScore: number,
  ): Promise<void> {
    await pool.query(MyFixturesQueries.UPDATE_FIXTURE_$FXID_$HSCORE_$ASCORE, [
      fixtureId,
      homeScore,
      awayScore,
    ]);
  }

  public async addPerformance(
    playerId: number,
    fixtureId: number,
    goalCount: number,
    assistCount: number,
  ): Promise<void> {
    await pool.query(
      MyFixturesQueries.ADD_PERFORMANCE_$PLID_$FXID_$GCOUNT_$ACOUNT,
      [playerId, fixtureId, goalCount, assistCount],
    );
  }

  public async updateStatistics(
    clubId: number,
    leagueId: number,
    winCount: number,
    drawCount: number,
    loseCount: number,
    scored: number,
    conceded: number,
  ): Promise<void> {
    await pool.query(
      MyFixturesQueries.UPDATE_STATISTICS_$CLID_$LGID_$WCOUNT_$DCOUNT_$LCOUNT_$SCORED_$CONCEDED,
      [clubId, leagueId, winCount, drawCount, loseCount, scored, conceded],
    );
  }

  public async wasTheLastFixtureOfSeason(leagueId: number): Promise<boolean> {
    const existsRes: QueryResult = await pool.query(
      MyFixturesQueries.IS_ALL_FIXTURES_IN_STATE_$LGID_$STATES,
      [leagueId, AVAILABLE_FIXTURE_STATES],
    );
    const existsRec: unknown = existsRes.rows[0];
    if (!existsRec) {
      throw new UnexpectedQueryResultError();
    }
    if (!ExistsModel.isValidModel(existsRec)) {
      throw new ModelMismatchError(existsRec);
    }
    return !(existsRec as IExistsModel).exists;
  }

  public async finishLeague(leagueId: number): Promise<void> {
    await pool.query("BEGIN");
    try {
      // Get champion
      const clubIdRes: QueryResult = await pool.query(
        MyFixturesQueries.GET_WINNER_CLUB_ID_$LGID,
        [leagueId],
      );
      const clubIdRec: unknown = clubIdRes.rows[0];
      if (!clubIdRec) {
        throw new UnexpectedQueryResultError();
      }
      if (!ClubModel.isValidIdModel(clubIdRec)) {
        throw new ModelMismatchError(clubIdRec);
      }
      // update cup count
      await pool.query(MyFixturesQueries.UPDATE_CUP_COUNT_$CLID, [
        clubIdRec.clubId,
      ]);
      // free league from clubs
      await pool.query(MyFixturesQueries.FREE_LEAGUE_FROM_CLUBS_$LGID, [
        leagueId,
      ]);
      // finish league
      await pool.query(MyFixturesQueries.SET_LEAGUE_STATE_$LGID_$STATE, [
        leagueId,
        LeagueState.FINISHED,
      ]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
