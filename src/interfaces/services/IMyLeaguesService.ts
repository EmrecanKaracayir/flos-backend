import { IMyLeaguesProvider } from "../providers/IMyLeaguesProvider";
import { IMyLeagues$ClubsReq } from "../schemas/requests/routes/my/leagues/$leagueId/clubs/IMyLeagues$ClubsReq";
import { IMyLeaguesReq } from "../schemas/requests/routes/my/leagues/IMyLeaguesReq";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IMyLeagues$Res } from "../schemas/responses/routes/my/leagues/$leagueId/IMyLeagues$Res";
import { IMyLeagues$Clubs$Res } from "../schemas/responses/routes/my/leagues/$leagueId/clubs/$clubId/IMyLeagues$Clubs$Res";
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
    req: IMyLeaguesReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeaguesRes | null>>;

  getMyLeagues$: (
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeagues$Res | null>>;

  putMyLeagues$: (
    organizerId: number,
    leagueId: number,
    req: IMyLeaguesReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeagues$Res | null>>;

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
    req: IMyLeagues$ClubsReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeagues$Clubs$Res>>;

  deleteMyLeagues$Clubs$: (
    organizerId: number,
    leagueId: number,
    clubId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<void | null>>;

  putMyLeagues$Start: (
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyLeaguesRes | null>>;
}
