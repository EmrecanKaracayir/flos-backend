import { ISignupProvider } from "../providers/ISignupProvider";
import { ISignupOrganizerReq } from "../schemas/requests/routes/signup/organizer/ISignupOrganizerReq";
import { ISignupParticipantReq } from "../schemas/requests/routes/signup/participant/ISignupParticipantReq";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { ISignupOrganizerRes } from "../schemas/responses/routes/signup/organizer/ISignupOrganizerRes";
import { ISignupParticipantRes } from "../schemas/responses/routes/signup/participant/ISignupParticipantRes";

export interface ISignupService {
  readonly signupProvider: ISignupProvider;

  postSignupOrganizer: (
    req: ISignupOrganizerReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<ISignupOrganizerRes | null>>;

  postSignupParticipant: (
    req: ISignupParticipantReq,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<ISignupParticipantRes | null>>;
}
