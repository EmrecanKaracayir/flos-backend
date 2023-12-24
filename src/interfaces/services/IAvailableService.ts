import { IAvailableProvider } from "../providers/IAvailableProvider";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { IClubsResData } from "../schemas/responses/routes/clubs/IClubsResData";
import { ILeaguesResData } from "../schemas/responses/routes/leagues/ILeaguesResData";
import { IPlayersResData } from "../schemas/responses/routes/players/IPlayersResData";

export interface IAvailableService {
  readonly availableProvider: IAvailableProvider;

  getAvailableClubs: (
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IClubsResData[]>>;

  getAvailableLeagues: (
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<ILeaguesResData[]>>;

  getAvailablePlayers: (
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IPlayersResData[]>>;
}
