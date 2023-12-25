import { IMyClubProvider } from "../providers/IMyClubProvider";
import { IMyClubReq } from "../schemas/requests/routes/my/club/IMyClubReq";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IMyClubRes } from "../schemas/responses/routes/my/club/IMyClubRes";

export interface IMyClubService {
  readonly myClubProvider: IMyClubProvider;

  getMyClub: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyClubRes | null>>;

  postMyClub: (
    participantId: number,
    dto: IMyClubReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyClubRes | null>>;

  putMyClub: (
    participantId: number,
    dto: IMyClubReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyClubRes | null>>;

  deleteMyClub: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<void | null>>;
}
