import { IMyClubProvider } from "../providers/IMyClubProvider";
import { IMyClubReq } from "../schemas/requests/routes/my/club/IMyClubReq";
import { IMyClubPlayersReq } from "../schemas/requests/routes/my/club/players/IMyClubPlayersReq";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IMyClubRes } from "../schemas/responses/routes/my/club/IMyClubRes";
import { IMyClubPlayersRes } from "../schemas/responses/routes/my/club/players/IMyClubPlayersRes";

export interface IMyClubService {
  readonly myClubProvider: IMyClubProvider;

  getMyClub: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyClubRes | null>>;

  postMyClub: (
    participantId: number,
    req: IMyClubReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyClubRes | null>>;

  putMyClub: (
    participantId: number,
    req: IMyClubReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyClubRes | null>>;

  deleteMyClub: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<void | null>>;

  getMyClubPlayers: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyClubPlayersRes[] | null>>;

  postMyClubPlayers: (
    participantId: number,
    req: IMyClubPlayersReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyClubPlayersRes | null>>;

  deleteMyClubPlayers$: (
    participantId: number,
    playerId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<void | null>>;
}
