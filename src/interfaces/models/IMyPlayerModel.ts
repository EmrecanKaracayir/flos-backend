import { PlayerState } from "../../core/enums/playerState";

export interface IMyPlayerModel {
  readonly playerId: number;
  readonly participantId: number;
  readonly clubName: string | null;
  readonly fullName: string;
  readonly state: PlayerState;
  readonly age: number;
  readonly goals: number;
  readonly assists: number;
  readonly participantEmail: string;
  readonly biography: string;
  readonly imgPath: string;
}
