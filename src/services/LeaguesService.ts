import { ILeagueModel } from "../interfaces/models/ILeagueModel";
import { ILeaguesProvider } from "../interfaces/providers/ILeaguesProvider";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { ILeaguesResData } from "../interfaces/schemas/responses/routes/leagues/ILeaguesResData";
import { ILeaguesService } from "../interfaces/services/ILeaguesService";
import { LeaguesProvider } from "../providers/LeaguesProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { LeaguesResData } from "../schemas/responses/routes/leagues/LeaguesResData";

export class LeaguesService implements ILeaguesService {
  public readonly leaguesProvider: ILeaguesProvider;

  constructor() {
    this.leaguesProvider = new LeaguesProvider();
  }

  public async getLeagues(
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<ILeaguesResData[]>> {
    const models: ILeagueModel[] = await this.leaguesProvider.getLeagueModels();
    return new GenericResponse<ILeaguesResData[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      LeaguesResData.fromModels(models),
      null,
    );
  }

  public async getLeagues$leagueId(
    leagueId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<ILeaguesResData>> {
    const model: ILeagueModel | null =
      await this.leaguesProvider.getLeagueModelById(leagueId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_LEAGUE_FOUND_IN_LEAGUES),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<ILeaguesResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      LeaguesResData.fromModel(model),
      null,
    );
  }
}
