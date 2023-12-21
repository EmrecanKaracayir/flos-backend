import { ClubState } from "../../core/enums/clubState";

export interface IClubModel {
  readonly clubId: number;
  readonly name: string;
  readonly state: ClubState;
  readonly playerCount: number;
  readonly cupCount: number;
  readonly participantEmail: string;
  readonly description: string;
  readonly logoPath: string;
}
