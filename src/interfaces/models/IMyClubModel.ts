import { ClubState } from "../../core/enums/clubState";

export interface IMyClubModel {
  readonly clubId: number;
  readonly participantId: number;
  readonly name: string;
  readonly state: ClubState;
  readonly playerCount: number;
  readonly cupCount: number;
  readonly participantEmail: string;
  readonly description: string;
  readonly logoPath: string;
}
