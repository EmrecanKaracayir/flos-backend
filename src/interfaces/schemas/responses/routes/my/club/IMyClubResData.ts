import { ClubState } from "../../../../../../core/enums/clubState";

export interface IMyClubResData {
  readonly clubId: number;
  readonly name: string;
  readonly state: ClubState;
  readonly playerCount: number;
  readonly cupCount: number;
  readonly email: string;
  readonly description: string;
  readonly logoPath: string;
}
