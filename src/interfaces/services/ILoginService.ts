import { ILoginProvider } from "../providers/ILoginProvider";
import { ILoginOrganizerReqDto } from "../schemas/requests/routes/login/organizer/ILoginOrganizerReqDto";
import { ILoginParticipantReqDto } from "../schemas/requests/routes/login/participant/ILoginParticipantReqDto";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { ILoginOrganizerResData } from "../schemas/responses/routes/login/organizer/ILoginOrganizerResData";
import { ILoginParticipantResData } from "../schemas/responses/routes/login/participant/ILoginParticipantResData";

export interface ILoginService {
  readonly loginProvider: ILoginProvider;

  postLoginOrganizer: (
    dto: ILoginOrganizerReqDto,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<ILoginOrganizerResData>>;

  postLoginParticipant: (
    dto: ILoginParticipantReqDto,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<ILoginParticipantResData>>;
}
