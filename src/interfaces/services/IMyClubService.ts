import { IMyClubProvider } from "../providers/IMyClubProvider";
import { IMyClubReqDto } from "../schemas/requests/routes/my/club/IMyClubReqDto";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { IMyClubResData } from "../schemas/responses/routes/my/club/IMyClubResData";

export interface IMyClubService {
  readonly myClubProvider: IMyClubProvider;

  getMyClub: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IMyClubResData | null>>;

  postMyClub: (
    participantId: number,
    dto: IMyClubReqDto,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IMyClubResData | null>>;

  putMyClub: (
    participantId: number,
    dto: IMyClubReqDto,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IMyClubResData | null>>;

  deleteMyClub: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<void | null>>;
}
