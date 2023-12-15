import { ISignupProvider } from "../providers/ISignupProvider";
import { ISignupOrganizerReqDto } from "../schemas/requests/routes/signup/organizer/ISignupOrganizerReqDto";
import { ISignupParticipantReqDto } from "../schemas/requests/routes/signup/participant/ISignupParticipantReqDto";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { ISignupOrganizerResData } from "../schemas/responses/routes/signup/organizer/ISignupOrganizerResData";
import { ISignupParticipantResData } from "../schemas/responses/routes/signup/participant/ISignupParticipantResData";

export interface ISignupService {
  readonly signupProvider: ISignupProvider;

  signupOrganizer: (
    dto: ISignupOrganizerReqDto,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<ISignupOrganizerResData>>;

  signupParticipant: (
    dto: ISignupParticipantReqDto,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<ISignupParticipantResData>>;
}
