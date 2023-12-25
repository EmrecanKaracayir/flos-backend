import { LeagueState } from "../../../core/enums/leagueState";

export interface IBaseLeagueModel {
  readonly leagueId: number;
  readonly name: string;
  readonly state: LeagueState;
  readonly prize: number;
  readonly organizerEmail: string;
  readonly description: string;
  readonly logoPath: string;
}
