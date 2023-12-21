import { IClubsResData } from "../clubs/IClubsResData";
import { ILeaguesResData } from "../leagues/ILeaguesResData";
import { IPlayersResData } from "../players/IPlayersResData";
import { IRefereesResData } from "../referees/IRefereesResData";
import { IVenuesResData } from "../venues/IVenuesResData";

export interface ISearchResData {
  readonly leagues: ILeaguesResData[];
  readonly clubs: IClubsResData[];
  readonly players: IPlayersResData[];
  readonly referees: IRefereesResData[];
  readonly venues: IVenuesResData[];
}
