import { IClubModel } from "../interfaces/models/IClubModel";
import { ILeagueModel } from "../interfaces/models/ILeagueModel";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import { IAvailableProvider } from "../interfaces/providers/IAvailableProvider";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import { IClientError } from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IAvailableClubsRes } from "../interfaces/schemas/responses/routes/available/clubs/IAvailableClubsRes";
import { IAvailableLeaguesRes } from "../interfaces/schemas/responses/routes/available/leagues/IAvailableLeaguesRes";
import { IAvailablePlayersRes } from "../interfaces/schemas/responses/routes/available/player/IAvailablePlayersRes";
import { IAvailableService } from "../interfaces/services/IAvailableService";
import { AvailableProvider } from "../providers/AvailableProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { AvailableClubsRes } from "../schemas/responses/routes/available/clubs/AvailableClubsRes";
import { AvailableLeaguesRes } from "../schemas/responses/routes/available/leagues/AvailableLeaguesRes";
import { AvailablePlayersRes } from "../schemas/responses/routes/available/players/AvailablePlayersRes";

export class AvailableService implements IAvailableService {
  public readonly availableProvider: IAvailableProvider;

  constructor() {
    this.availableProvider = new AvailableProvider();
  }

  public async getAvailableClubs(
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IAvailableClubsRes[]>> {
    const models: IClubModel[] =
      await this.availableProvider.getAvailableClubs();
    return new AppResponse<IAvailableClubsRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      AvailableClubsRes.fromModels(models),
      null,
    );
  }

  public async getAvailableLeagues(
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IAvailableLeaguesRes[]>> {
    const models: ILeagueModel[] =
      await this.availableProvider.getAvailableLeagues();
    return new AppResponse<IAvailableLeaguesRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      AvailableLeaguesRes.fromModels(models),
      null,
    );
  }

  public async getAvailablePlayers(
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IAvailablePlayersRes[]>> {
    const models: IPlayerModel[] =
      await this.availableProvider.getAvailablePlayers();
    return new AppResponse<IAvailablePlayersRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      AvailablePlayersRes.fromModels(models),
      null,
    );
  }
}
