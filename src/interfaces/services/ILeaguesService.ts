import { ILeaguesProvider } from "../providers/ILeaguesProvider";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { ILeaguesResData } from "../schemas/responses/routes/leagues/ILeaguesResData";

export interface ILeaguesService {
  readonly leaguesProvider: ILeaguesProvider;

  getLeagues: (
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<ILeaguesResData[]>>;

  getLeagues$leagueId: (
    leagueId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<ILeaguesResData | null>>;
}
