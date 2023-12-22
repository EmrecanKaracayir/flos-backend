import { EncryptionHelper } from "../core/helpers/EncryptionHelper";
import { IOrganizerModel } from "../interfaces/models/IOrganizerModel";
import { IParticipantModel } from "../interfaces/models/IParticipantModel";
import { ILoginProvider } from "../interfaces/providers/ILoginProvider";
import { ILoginOrganizerReqDto } from "../interfaces/schemas/requests/routes/login/organizer/ILoginOrganizerReqDto";
import { ILoginParticipantReqDto } from "../interfaces/schemas/requests/routes/login/participant/ILoginParticipantReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { ILoginOrganizerResData } from "../interfaces/schemas/responses/routes/login/organizer/ILoginOrganizerResData";
import { ILoginParticipantResData } from "../interfaces/schemas/responses/routes/login/participant/ILoginParticipantResData";
import { ILoginService } from "../interfaces/services/ILoginService";
import { LoginProvider } from "../providers/LoginProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { LoginOrganizerResData } from "../schemas/responses/routes/login/organizer/LoginOrganizerResData";
import { LoginParticipantResData } from "../schemas/responses/routes/login/participant/LoginParticipantResData";

export class LoginService implements ILoginService {
  public readonly loginProvider: ILoginProvider;

  constructor() {
    this.loginProvider = new LoginProvider();
  }

  public async postLoginOrganizer(
    dto: ILoginOrganizerReqDto,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<ILoginOrganizerResData | null>> {
    const model: IOrganizerModel | null =
      await this.loginProvider.getOrganizerModelByUsername(dto.username);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND_IN_ORGANIZERS),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await EncryptionHelper.compare(dto.password, model.password))) {
      clientErrors.push(new ClientError(ClientErrorCode.INCORRECT_PASSWORD));
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<ILoginOrganizerResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      LoginOrganizerResData.fromModel(model),
      null,
    );
  }

  public async postLoginParticipant(
    dto: ILoginParticipantReqDto,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<ILoginParticipantResData | null>> {
    const model: IParticipantModel | null =
      await this.loginProvider.getParticipantModelByUsername(dto.username);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND_IN_PARTICIPANTS),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await EncryptionHelper.compare(dto.password, model.password))) {
      clientErrors.push(new ClientError(ClientErrorCode.INCORRECT_PASSWORD));
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<ILoginParticipantResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      LoginParticipantResData.fromModel(model),
      null,
    );
  }
}
