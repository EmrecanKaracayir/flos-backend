import { PlayerState } from "../../../core/enums/playerState";

export interface IBasePlayerModel {
  readonly playerId: number;
  readonly clubName: string | null;
  readonly fullName: string;
  readonly state: PlayerState;
  readonly age: number;
  readonly goals: string;
  readonly assists: string;
  readonly participantEmail: string;
  readonly biography: string;
  readonly imgPath: string;
}
