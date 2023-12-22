import { IMyPlayerProvider } from "../providers/IMyPlayerProvider";
import { IMyPlayerReqDto } from "../schemas/requests/routes/my/player/IMyPlayerReqDto";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { IMyPlayerResData } from "../schemas/responses/routes/my/player/IMyPlayerResData";

export interface IMyPlayerService {
  readonly myPlayerProvider: IMyPlayerProvider;

  getMyPlayer: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IMyPlayerResData | null>>;

  postMyPlayer: (
    participantId: number,
    dto: IMyPlayerReqDto,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IMyPlayerResData | null>>;
}
