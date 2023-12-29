import { ILoginProvider } from "../providers/ILoginProvider";
import { ILoginOrganizerReq } from "../schemas/requests/routes/login/organizer/ILoginOrganizerReq";
import { ILoginParticipantReq } from "../schemas/requests/routes/login/participant/ILoginParticipantReq";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { ILoginOrganizerRes } from "../schemas/responses/routes/login/organizer/ILoginOrganizerRes";
import { ILoginParticipantRes } from "../schemas/responses/routes/login/participant/ILoginParticipantRes";

export interface ILoginService {
  readonly loginProvider: ILoginProvider;

  postLoginOrganizer: (
    req: ILoginOrganizerReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<ILoginOrganizerRes | null>>;

  postLoginParticipant: (
    req: ILoginParticipantReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<ILoginParticipantRes | null>>;
}
