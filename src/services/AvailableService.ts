import { IClubModel } from "../interfaces/models/IClubModel";
import { ILeagueModel } from "../interfaces/models/ILeagueModel";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import { IAvailableProvider } from "../interfaces/providers/IAvailableProvider";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import { IClientError } from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { IClubsResData } from "../interfaces/schemas/responses/routes/clubs/IClubsResData";
import { ILeaguesResData } from "../interfaces/schemas/responses/routes/leagues/ILeaguesResData";
import { IPlayersResData } from "../interfaces/schemas/responses/routes/players/IPlayersResData";
import { IAvailableService } from "../interfaces/services/IAvailableService";
import { AvailableProvider } from "../providers/AvailableProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { ClubsResData } from "../schemas/responses/routes/clubs/ClubsResData";
import { LeaguesResData } from "../schemas/responses/routes/leagues/LeaguesResData";
import { PlayersResData } from "../schemas/responses/routes/players/PlayersResData";

export class AvailableService implements IAvailableService {
  public readonly availableProvider: IAvailableProvider;

  constructor() {
    this.availableProvider = new AvailableProvider();
  }

  public async getAvailableClubs(
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IClubsResData[]>> {
    const models: IClubModel[] =
      await this.availableProvider.getAvailableClubModels();
    return new GenericResponse<IClubsResData[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      ClubsResData.fromModels(models),
      null,
    );
  }

  public async getAvailableLeagues(
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<ILeaguesResData[]>> {
    const models: ILeagueModel[] =
      await this.availableProvider.getAvailableLeagueModels();
    return new GenericResponse<ILeaguesResData[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      LeaguesResData.fromModels(models),
      null,
    );
  }

  public async getAvailablePlayers(
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IPlayersResData[]>> {
    const models: IPlayerModel[] =
      await this.availableProvider.getAvailablePlayerModels();
    return new GenericResponse<IPlayersResData[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      PlayersResData.fromModels(models),
      null,
    );
  }
}
