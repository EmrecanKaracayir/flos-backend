import { EncryptionHelper } from "../core/helpers/EncryptionHelper";
import { IOrganizerModel } from "../interfaces/models/IOrganizerModel";
import { IParticipantModel } from "../interfaces/models/IParticipantModel";
import { ILoginProvider } from "../interfaces/providers/ILoginProvider";
import { ILoginOrganizerReq } from "../interfaces/schemas/requests/routes/login/organizer/ILoginOrganizerReq";
import { ILoginParticipantReq } from "../interfaces/schemas/requests/routes/login/participant/ILoginParticipantReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { ILoginOrganizerRes } from "../interfaces/schemas/responses/routes/login/organizer/ILoginOrganizerRes";
import { ILoginParticipantRes } from "../interfaces/schemas/responses/routes/login/participant/ILoginParticipantRes";
import { ILoginService } from "../interfaces/services/ILoginService";
import { LoginProvider } from "../providers/LoginProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { LoginOrganizerRes } from "../schemas/responses/routes/login/organizer/LoginOrganizerRes";
import { LoginParticipantRes } from "../schemas/responses/routes/login/participant/LoginParticipantRes";

export class LoginService implements ILoginService {
  public readonly loginProvider: ILoginProvider;

  constructor() {
    this.loginProvider = new LoginProvider();
  }

  public async postLoginOrganizer(
    req: ILoginOrganizerReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<ILoginOrganizerRes | null>> {
    const model: IOrganizerModel | null = await this.loginProvider.getOrganizer(
      req.username,
    );
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND_IN_ORGANIZERS),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await EncryptionHelper.compare(req.password, model.password))) {
      clientErrors.push(new ClientError(ClientErrorCode.INCORRECT_PASSWORD));
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<ILoginOrganizerRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      LoginOrganizerRes.fromModel(model),
      null,
    );
  }

  public async postLoginParticipant(
    req: ILoginParticipantReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<ILoginParticipantRes | null>> {
    const model: IParticipantModel | null =
      await this.loginProvider.getParticipant(req.username);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND_IN_PARTICIPANTS),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await EncryptionHelper.compare(req.password, model.password))) {
      clientErrors.push(new ClientError(ClientErrorCode.INCORRECT_PASSWORD));
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<ILoginParticipantRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      LoginParticipantRes.fromModel(model),
      null,
    );
  }
}
