import { IMyPlayerProvider } from "../providers/IMyPlayerProvider";
import { IMyPlayerReq } from "../schemas/requests/routes/my/player/IMyPlayerReq";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IMyPlayerRes } from "../schemas/responses/routes/my/player/IMyPlayerRes";

export interface IMyPlayerService {
  readonly myPlayerProvider: IMyPlayerProvider;

  getMyPlayer: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyPlayerRes | null>>;

  postMyPlayer: (
    participantId: number,
    dto: IMyPlayerReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyPlayerRes | null>>;

  putMyPlayer: (
    participantId: number,
    dto: IMyPlayerReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IMyPlayerRes | null>>;

  deleteMyPlayer: (
    participantId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<void | null>>;
}
