import { FixtureState } from "../../../../core/enums/fixtureState";

export interface IBaseFixturesRes {
  readonly fixtureId: number;
  readonly leagueId: number;
  readonly leagueName: string;
  readonly homeClubId: number;
  readonly awayClubId: number;
  readonly homeClubName: string;
  readonly awayClubName: string;
  readonly homeClubRank: number;
  readonly awayClubRank: number;
  readonly homeClubLogoPath: string;
  readonly awayClubLogoPath: string;
  readonly homeTeamScore: number | null;
  readonly awayTeamScore: number | null;
  readonly week: number;
  readonly refereeId: number;
  readonly refereeName: string;
  readonly venueId: number;
  readonly venueName: string;
  readonly state: FixtureState;
}
