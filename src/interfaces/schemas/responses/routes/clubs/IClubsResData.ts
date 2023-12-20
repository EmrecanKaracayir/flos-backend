import { ClubState } from "../../../../models/IClubModel";

export interface IClubsResData {
  readonly clubId: number;
  readonly name: string;
  readonly state: ClubState;
  readonly playerCount: number;
  readonly cupCount: number;
  readonly email: string;
  readonly description: string;
  readonly logoPath: string;
}
