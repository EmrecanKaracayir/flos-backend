import { IMyLeaguesProvider } from "../providers/IMyLeaguesProvider";
import { IMyLeagues$ClubsReq } from "../schemas/requests/routes/my/leagues/$/clubs/IMyLeagues$ClubsReq";
import { IMyLeaguesReq } from "../schemas/requests/routes/my/leagues/IMyLeaguesReq";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IMyLeagues$ClubsRes } from "../schemas/responses/routes/my/leagues/$leagueId/clubs/IMyLeagues$ClubsRes";
import { IMyLeaguesRes } from "../schemas/responses/routes/my/leagues/IMyLeaguesRes";

export interface IMyLeaguesService {
  readonly myLeaguesProvider: IMyLeaguesProvider;

  getMyLeagues: (
    organizerId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeaguesRes[]>>;

  postMyLeagues: (
    organizerId: number,
    dto: IMyLeaguesReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeaguesRes | null>>;

  getMyLeagues$: (
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeaguesRes | null>>;

  putMyLeagues$: (
    organizerId: number,
    leagueId: number,
    dto: IMyLeaguesReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeaguesRes | null>>;

  deleteMyLeagues$: (
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<void | null>>;

  getMyLeagues$Clubs: (
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeagues$ClubsRes[]>>;

  postMyLeagues$Clubs: (
    organizerId: number,
    leagueId: number,
    dto: IMyLeagues$ClubsReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeagues$ClubsRes[]>>;
}
