import { ClubState } from "../../../../core/enums/clubState";

export interface IBaseClubRes {
  readonly clubId: number;
  readonly leagueName: string | null;
  readonly name: string;
  readonly state: ClubState;
  readonly playerCount: number;
  readonly cupCount: number;
  readonly email: string;
  readonly description: string;
  readonly logoPath: string;
}
