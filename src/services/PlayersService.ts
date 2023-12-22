import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import { IPlayersProvider } from "../interfaces/providers/IPlayersProvider";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { IPlayersResData } from "../interfaces/schemas/responses/routes/players/IPlayersResData";
import { IPlayersService } from "../interfaces/services/IPlayersService";
import { PlayersProvider } from "../providers/PlayersProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { PlayersResData } from "../schemas/responses/routes/players/PlayersResData";

export class PlayersService implements IPlayersService {
  public readonly playersProvider: IPlayersProvider;

  constructor() {
    this.playersProvider = new PlayersProvider();
  }

  public async getPlayers(
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IPlayersResData[]>> {
    const models: IPlayerModel[] = await this.playersProvider.getPlayerModels();
    return new GenericResponse<IPlayersResData[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      PlayersResData.fromModels(models),
      null,
    );
  }

  public async getPlayers$playerId(
    playerId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IPlayersResData | null>> {
    const model: IPlayerModel | null =
      await this.playersProvider.getPlayerModelById(playerId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_PLAYER_FOUND_IN_PLAYERS),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<IPlayersResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      PlayersResData.fromModel(model),
      null,
    );
  }
}
