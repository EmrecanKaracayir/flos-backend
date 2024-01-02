import { IBaseClubRes } from "../../../base/IBaseClubRes";
import { IPlayersRes } from "../../players/IPlayersRes";

export interface IClubs$Res extends IBaseClubRes {
  readonly players: IPlayersRes[];
}
