import { EncryptionHelper } from "../core/helpers/EncryptionHelper";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  EMAIL_MUST_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MUST_REGEX,
  USERNAME_ALLOWED_CHARACTERS_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../core/rules/accountRules";
import {
  isStringInLengthBetween,
  isStringMatchingRegex,
} from "../core/utils/strings";
import { IOrganizerModel } from "../interfaces/models/IOrganizerModel";
import { IParticipantModel } from "../interfaces/models/IParticipantModel";
import { ISignupProvider } from "../interfaces/providers/ISignupProvider";
import { ISignupOrganizerReq } from "../interfaces/schemas/requests/routes/signup/organizer/ISignupOrganizerReq";
import { ISignupParticipantReq } from "../interfaces/schemas/requests/routes/signup/participant/ISignupParticipantReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { ISignupOrganizerRes } from "../interfaces/schemas/responses/routes/signup/organizer/ISignupOrganizerRes";
import { ISignupParticipantRes } from "../interfaces/schemas/responses/routes/signup/participant/ISignupParticipantRes";
import { ISignupService } from "../interfaces/services/ISignupService";
import { SignupProvider } from "../providers/SignupProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { SignupOrganizerRes } from "../schemas/responses/routes/signup/organizer/SignupOrganizerRes";
import { SignupParticipantRes } from "../schemas/responses/routes/signup/participant/SignupParticipantRes";

export class SignupService implements ISignupService {
  public readonly signupProvider: ISignupProvider;

  constructor() {
    this.signupProvider = new SignupProvider();
  }

  public async postSignupOrganizer(
    req: ISignupOrganizerReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<ISignupOrganizerRes | null>> {
    const username: string = req.username.toLowerCase();
    const password: string = req.password;
    const email: string = req.email.toLowerCase();
    this.validateFields(username, password, email, clientErrors);
    if (clientErrors.length > 0) {
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        clientErrors,
        null,
        null,
      );
    }
    clientErrors = [];
    if (await this.signupProvider.doesOrganizerByUsernameExist(username)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.USERNAME_ALREADY_EXISTS),
      );
    }
    if (await this.signupProvider.doesOrganizerByEmailExist(email)) {
      clientErrors.push(new ClientError(ClientErrorCode.EMAIL_ALREADY_EXISTS));
    }
    if (clientErrors.length > 0) {
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    const hashedPassword: string = await EncryptionHelper.encrypt(password);
    const model: IOrganizerModel = await this.signupProvider.createOrganizer(
      username,
      hashedPassword,
      email,
    );
    return new AppResponse<ISignupOrganizerRes>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      SignupOrganizerRes.fromModel(model),
      null,
    );
  }

  public async postSignupParticipant(
    req: ISignupParticipantReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<ISignupParticipantRes | null>> {
    const username: string = req.username.toLowerCase();
    const password: string = req.password;
    const email: string = req.email.toLowerCase();
    this.validateFields(username, password, email, clientErrors);
    if (clientErrors.length > 0) {
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (await this.signupProvider.doesParticipantByUsernameExist(username)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.USERNAME_ALREADY_EXISTS),
      );
    }
    if (await this.signupProvider.doesParticipantByEmailExist(email)) {
      clientErrors.push(new ClientError(ClientErrorCode.EMAIL_ALREADY_EXISTS));
    }
    if (clientErrors.length > 0) {
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    const hashedPassword: string = await EncryptionHelper.encrypt(password);
    const model: IParticipantModel =
      await this.signupProvider.createParticipant(
        username,
        hashedPassword,
        email,
      );
    return new AppResponse<ISignupParticipantRes>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      SignupParticipantRes.fromModel(model),
      null,
    );
  }

  private validateFields(
    usernameLowercased: string,
    password: string,
    emailLowercased: string,
    clientErrors: IClientError[],
  ): void {
    // Username validation
    if (
      !isStringInLengthBetween(
        usernameLowercased,
        USERNAME_MIN_LENGTH,
        USERNAME_MAX_LENGTH,
      )
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_USERNAME_LENGTH),
      );
    }
    if (
      !isStringMatchingRegex(
        usernameLowercased,
        USERNAME_ALLOWED_CHARACTERS_REGEX,
      )
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_USERNAME_CONTENT),
      );
    }
    // Password validation
    if (
      !isStringInLengthBetween(
        password,
        PASSWORD_MIN_LENGTH,
        PASSWORD_MAX_LENGTH,
      )
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_PASSWORD_LENGTH),
      );
    }
    if (!isStringMatchingRegex(password, PASSWORD_MUST_REGEX)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_PASSWORD_CONTENT),
      );
    }
    // Email validation
    if (
      !isStringInLengthBetween(
        emailLowercased,
        EMAIL_MIN_LENGTH,
        EMAIL_MAX_LENGTH,
      )
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_EMAIL_LENGTH));
    }
    if (!isStringMatchingRegex(emailLowercased, EMAIL_MUST_REGEX)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_EMAIL_CONTENT));
    }
  }
}
