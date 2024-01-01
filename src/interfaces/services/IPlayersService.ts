import { IPlayersProvider } from "../providers/IPlayersProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IPlayers$Res } from "../schemas/responses/routes/players/$playerId/IPlayers$Res";
import { IPlayersRes } from "../schemas/responses/routes/players/IPlayersRes";

export interface IPlayersService {
  readonly playersProvider: IPlayersProvider;

  getPlayers: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IPlayersRes[]>>;

  getPlayers$: (
    playerId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IPlayers$Res | null>>;
}
