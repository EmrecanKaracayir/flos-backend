import { LeagueState } from "../../../../../core/enums/leagueState";

export interface ILeaguesResData {
  readonly leagueId: number;
  readonly name: string;
  readonly state: LeagueState;
  readonly prize: number;
  readonly email: string;
  readonly description: string;
  readonly logoPath: string;
}
