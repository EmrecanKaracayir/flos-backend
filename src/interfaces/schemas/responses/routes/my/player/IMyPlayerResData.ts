import { PlayerState } from "../../../../../../core/enums/playerState";

export interface IMyPlayerResData {
  readonly playerId: number;
  readonly clubName: string | null;
  readonly fullName: string;
  readonly state: PlayerState;
  readonly age: number;
  readonly goals: number;
  readonly assists: number;
  readonly email: string;
  readonly biography: string;
  readonly imgPath: string;
}
