import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import { IPlayersProvider } from "../interfaces/providers/IPlayersProvider";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IPlayers$Res } from "../interfaces/schemas/responses/routes/players/$playerId/IPlayers$Res";
import { IPlayersRes } from "../interfaces/schemas/responses/routes/players/IPlayersRes";
import { IPlayersService } from "../interfaces/services/IPlayersService";
import { PlayersProvider } from "../providers/PlayersProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { PlayersRes } from "../schemas/responses/routes/players/PlayersRes";

export class PlayersService implements IPlayersService {
  public readonly playersProvider: IPlayersProvider;

  constructor() {
    this.playersProvider = new PlayersProvider();
  }

  public async getPlayers(
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IPlayersRes[]>> {
    const models: IPlayerModel[] = await this.playersProvider.getPlayers();
    return new AppResponse<IPlayersRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      PlayersRes.fromModels(models),
      null,
    );
  }

  public async getPlayers$(
    playerId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IPlayers$Res | null>> {
    const model: IPlayerModel | null =
      await this.playersProvider.getPlayer(playerId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_PLAYER_FOUND_IN_PLAYERS),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IPlayers$Res>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      PlayersRes.fromModel(model),
      null,
    );
  }
}
