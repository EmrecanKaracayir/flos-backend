import { IAvailableProvider } from "../providers/IAvailableProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IAvailableClubsRes } from "../schemas/responses/routes/available/clubs/IAvailableClubsRes";
import { IAvailableLeaguesRes } from "../schemas/responses/routes/available/leagues/IAvailableLeaguesRes";
import { IAvailablePlayersRes } from "../schemas/responses/routes/available/player/IAvailablePlayersRes";

export interface IAvailableService {
  readonly availableProvider: IAvailableProvider;

  getAvailableClubs: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IAvailableClubsRes[]>>;

  getAvailableLeagues: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IAvailableLeaguesRes[]>>;

  getAvailablePlayers: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IAvailablePlayersRes[]>>;
}
