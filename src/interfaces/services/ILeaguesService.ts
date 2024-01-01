import { ILeaguesProvider } from "../providers/ILeaguesProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { ILeagues$Res } from "../schemas/responses/routes/leagues/$leagueId/ILeagues$Res";
import { ILeaguesRes } from "../schemas/responses/routes/leagues/ILeaguesRes";

export interface ILeaguesService {
  readonly leaguesProvider: ILeaguesProvider;

  getLeagues: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<ILeaguesRes[]>>;

  getLeagues$: (
    leagueId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<ILeagues$Res | null>>;
}
