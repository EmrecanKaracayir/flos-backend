import { IMyClubPlayerModel } from "../models/IMyClubPlayerModel";
import { IMyFixtureModel } from "../models/IMyFixtureModel";

export interface IMyFixturesProvider {
  getMyFixtures: (organizerId: number) => Promise<IMyFixtureModel[]>;

  getMyFixture: (
    organizerId: number,
    fixtureId: number,
  ) => Promise<IMyFixtureModel | null>;

  doesMyFixtureExist: (
    organizerId: number,
    fixtureId: number,
  ) => Promise<boolean>;

  isMyFixtureAvailable: (fixtureId: number) => Promise<boolean>;

  getMyClubPlayers: (clubId: number) => Promise<IMyClubPlayerModel[]>;

  updateFixture: (
    fixtureId: number,
    homeScore: number,
    awayScore: number,
  ) => Promise<void>;

  addPerformance: (
    playerId: number,
    fixtureId: number,
    goalCount: number,
    assistCount: number,
  ) => Promise<void>;

  updateStatistics: (
    clubId: number,
    leagueId: number,
    winCount: number,
    drawCount: number,
    loseCount: number,
    scored: number,
    conceded: number,
  ) => Promise<void>;

  wasTheLastFixtureOfSeason: (leagueId: number) => Promise<boolean>;

  finishLeague: (leagueId: number) => Promise<void>;
}

export enum MyFixturesQueries {
  GET_MY_FIXTURES_$ORID_$STATE = `SELECT * FROM "MyFixtureView" WHERE "organizerId" = $1 AND "state" = ANY($2::"FixtureState"[])`,
  GET_MY_FIXTURE_$ORID_$FXID = `SELECT * FROM "MyFixtureView" WHERE "organizerId" = $1 AND "fixtureId" = $2`,
  DOES_MY_FIXTURE_EXIST_$ORID_$FXID = `SELECT EXISTS(SELECT 1 FROM "MyFixtureView" WHERE "organizerId" = $1 AND "fixtureId" = $2) as "exists"`,
  IS_FIXTURE_IN_STATE_$FXID_$STATES = `SELECT EXISTS (SELECT "state" FROM "FixtureView" WHERE "fixtureId" = $1 AND "state" = ANY($2::"FixtureState"[])) AS "exists"`,
  GET_MY_CLUB_PLAYERS_$CLID = `SELECT * FROM "MyClubPlayerView" WHERE "clubId" = $1`,
  UPDATE_FIXTURE_$FXID_$HSCORE_$ASCORE = `UPDATE "Fixture" SET "homeTeamScore" = $2, "awayTeamScore" = $3 WHERE "fixtureId" = $1`,
  ADD_PERFORMANCE_$PLID_$FXID_$GCOUNT_$ACOUNT = `INSERT INTO "Performance" ("playerId", "fixtureId", "goalCount", "assistCount") VALUES ($1, $2, $3, $4)`,
  UPDATE_STATISTICS_$CLID_$LGID_$WCOUNT_$DCOUNT_$LCOUNT_$SCORED_$CONCEDED = `UPDATE "Statistics" SET "winCount" = "winCount" + $3, "drawCount" = "drawCount" + $4, "loseCount" = "loseCount" + $5, "scored" = "scored" + $6, "conceded" = "conceded" + $7 WHERE "clubId" = $1 AND "leagueId" = $2`,
  GET_WINNER_CLUB_ID_$LGID = `SELECT "clubId" FROM "MyLeagueClubView" WHERE "leagueId" = $1 LIMIT 1`,
  UPDATE_CUP_COUNT_$CLID = `UPDATE "Club" SET "cupCount" = "cupCount" + 1 WHERE "clubId" = $1`,
  IS_ALL_FIXTURES_IN_STATE_$LGID_$STATES = `SELECT EXISTS (SELECT "state" FROM "FixtureView" WHERE "leagueId" = $1 AND "state" = ANY($2::"FixtureState"[])) AS "exists"`,
  SET_LEAGUE_STATE_$LGID_$STATE = `UPDATE "League" SET "state" = $2::"LeagueState" WHERE "leagueId" = $1`,
  FREE_LEAGUE_FROM_CLUBS_$LGID = `UPDATE "Club" SET "leagueId" = NULL WHERE "leagueId" = $1`,
}
