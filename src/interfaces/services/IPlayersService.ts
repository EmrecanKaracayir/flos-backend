import { IPlayersProvider } from "../providers/IPlayersProvider";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { IPlayersResData } from "../schemas/responses/routes/players/IPlayersResData";

export interface IPlayersService {
  readonly playersProvider: IPlayersProvider;

  getPlayers: (
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IPlayersResData[]>>;

  getPlayers$playerId: (
    playerId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IPlayersResData>>;
}
