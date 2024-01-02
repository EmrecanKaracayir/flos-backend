import { IBaseClubRes } from "../../../base/IBaseClubRes";
import { IPlayersRes } from "../../players/IPlayersRes";

export interface IMyClubRes extends IBaseClubRes {
  readonly players: IPlayersRes[];
}
