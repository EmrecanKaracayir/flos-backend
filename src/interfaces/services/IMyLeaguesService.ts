import { IMyLeaguesProvider } from "../providers/IMyLeaguesProvider";
import { IMyLeaguesReqDto } from "../schemas/requests/routes/my/leagues/IMyLeaguesReqDto";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { IMyLeaguesResData } from "../schemas/responses/routes/my/leagues/IMyLeaguesResData";

export interface IMyLeaguesService {
  readonly myLeaguesProvider: IMyLeaguesProvider;

  getMyLeagues: (
    organizerId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IMyLeaguesResData[]>>;

  postMyLeagues: (
    organizerId: number,
    dto: IMyLeaguesReqDto,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IMyLeaguesResData | null>>;

  getMyLeagues$leagueId: (
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IMyLeaguesResData | null>>;
}
