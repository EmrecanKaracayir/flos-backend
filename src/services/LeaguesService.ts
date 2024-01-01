import { ILeagueModel } from "../interfaces/models/ILeagueModel";
import { ILeaguesProvider } from "../interfaces/providers/ILeaguesProvider";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { ILeagues$Res } from "../interfaces/schemas/responses/routes/leagues/$leagueId/ILeagues$Res";
import { ILeaguesRes } from "../interfaces/schemas/responses/routes/leagues/ILeaguesRes";
import { ILeaguesService } from "../interfaces/services/ILeaguesService";
import { LeaguesProvider } from "../providers/LeaguesProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { LeaguesRes } from "../schemas/responses/routes/leagues/LeaguesRes";

export class LeaguesService implements ILeaguesService {
  public readonly leaguesProvider: ILeaguesProvider;

  constructor() {
    this.leaguesProvider = new LeaguesProvider();
  }

  public async getLeagues(
    clientErrors: IClientError[],
  ): Promise<IAppResponse<ILeaguesRes[]>> {
    const models: ILeagueModel[] = await this.leaguesProvider.getLeagues();
    return new AppResponse<ILeaguesRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      LeaguesRes.fromModels(models),
      null,
    );
  }

  public async getLeagues$(
    leagueId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<ILeagues$Res | null>> {
    const model: ILeagueModel | null =
      await this.leaguesProvider.getLeague(leagueId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_LEAGUE_FOUND_IN_LEAGUES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<ILeagues$Res>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      LeaguesRes.fromModel(model),
      null,
    );
  }
}
