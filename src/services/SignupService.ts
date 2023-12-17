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
import { ISignupOrganizerReqDto } from "../interfaces/schemas/requests/routes/signup/organizer/ISignupOrganizerReqDto";
import { ISignupParticipantReqDto } from "../interfaces/schemas/requests/routes/signup/participant/ISignupParticipantReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { ISignupOrganizerResData } from "../interfaces/schemas/responses/routes/signup/organizer/ISignupOrganizerResData";
import { ISignupParticipantResData } from "../interfaces/schemas/responses/routes/signup/participant/ISignupParticipantResData";
import { ISignupService } from "../interfaces/services/ISignupService";
import { SignupProvider } from "../providers/SignupProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { SignupOrganizerResData } from "../schemas/responses/routes/signup/organizer/SignupOrganizerResData";
import { SignupParticipantResData } from "../schemas/responses/routes/signup/participant/SignupParticipantResData";

export class SignupService implements ISignupService {
  public readonly signupProvider: ISignupProvider;

  constructor() {
    this.signupProvider = new SignupProvider();
  }

  public async postSignupOrganizer(
    dto: ISignupOrganizerReqDto,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<ISignupOrganizerResData>> {
    const username: string = dto.username.toLowerCase();
    const password: string = dto.password;
    const email: string = dto.email.toLowerCase();
    await this.validateFields(username, password, email, clientErrors);
    if (clientErrors.length > 0) {
      return new GenericResponse<ISignupOrganizerResData>(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        clientErrors,
        null,
        null,
      );
    }
    clientErrors = [];
    if (
      (await this.signupProvider.doesOrganizerByUsernameExist(username))
        .recordExists
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.USERNAME_ALREADY_EXISTS),
      );
    }
    if (
      (await this.signupProvider.doesOrganizerByEmailExist(email)).recordExists
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.EMAIL_ALREADY_EXISTS));
    }
    if (clientErrors.length > 0) {
      return new GenericResponse<ISignupOrganizerResData>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    const hashedPassword: string = await EncryptionHelper.encrypt(password);
    const organizerModel: IOrganizerModel =
      await this.signupProvider.createOrganizer(
        username,
        hashedPassword,
        email,
      );
    return new GenericResponse<ISignupOrganizerResData>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      new SignupOrganizerResData(
        organizerModel.organizerId,
        organizerModel.username,
        organizerModel.email,
      ),
      null,
    );
  }

  public async postSignupParticipant(
    dto: ISignupParticipantReqDto,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<ISignupParticipantResData>> {
    const username: string = dto.username.toLowerCase();
    const password: string = dto.password;
    const email: string = dto.email.toLowerCase();
    await this.validateFields(username, password, email, clientErrors);
    if (clientErrors.length > 0) {
      return new GenericResponse<ISignupParticipantResData>(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        clientErrors,
        null,
        null,
      );
    }
    clientErrors = [];
    if (
      (await this.signupProvider.doesParticipantByUsernameExist(username))
        .recordExists
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.USERNAME_ALREADY_EXISTS),
      );
    }
    if (
      (await this.signupProvider.doesParticipantByEmailExist(email))
        .recordExists
    ) {
      clientErrors.push(new ClientError(ClientErrorCode.EMAIL_ALREADY_EXISTS));
    }
    if (clientErrors.length > 0) {
      return new GenericResponse<ISignupParticipantResData>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    const hashedPassword: string = await EncryptionHelper.encrypt(password);
    const participantModel: IParticipantModel =
      await this.signupProvider.createParticipant(
        username,
        hashedPassword,
        email,
      );
    return new GenericResponse<ISignupParticipantResData>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      new SignupParticipantResData(
        participantModel.participantId,
        participantModel.username,
        participantModel.email,
      ),
      null,
    );
  }

  private async validateFields(
    usernameLowercased: string,
    password: string,
    emailLowercased: string,
    clientErrors: IClientError[],
  ): Promise<void> {
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
