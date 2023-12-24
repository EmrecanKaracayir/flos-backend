import {
  CLUB_DESCRIPTION_MAX_LENGTH,
  CLUB_DESCRIPTION_MIN_LENGTH,
  CLUB_NAME_MAX_LENGTH,
  CLUB_NAME_MIN_LENGTH,
} from "../core/rules/clubRules";
import { URL_MUST_REGEX } from "../core/rules/common/urlRules";
import {
  isStringInLengthBetween,
  isStringMatchingRegex,
} from "../core/utils/strings";
import { IMyClubModel } from "../interfaces/models/IMyClubModel";
import { IMyClubProvider } from "../interfaces/providers/IMyClubProvider";
import { IMyClubReqDto } from "../interfaces/schemas/requests/routes/my/club/IMyClubReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { IMyClubResData } from "../interfaces/schemas/responses/routes/my/club/IMyClubResData";
import { IMyClubService } from "../interfaces/services/IMyClubService";
import { MyClubProvider } from "../providers/MyClubProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { MyClubResData } from "../schemas/responses/routes/my/club/MyClubResData";

export class MyClubService implements IMyClubService {
  public readonly myClubProvider: IMyClubProvider;

  constructor() {
    this.myClubProvider = new MyClubProvider();
  }

  public async getMyClub(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IMyClubResData | null>> {
    const model: IMyClubModel | null =
      await this.myClubProvider.getMyClubModel(participantId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_CLUB),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<IMyClubResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyClubResData.fromModel(model),
      null,
    );
  }

  public async postMyClub(
    participantId: number,
    dto: IMyClubReqDto,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IMyClubResData | null>> {
    if (await this.myClubProvider.doesMyClubExist(participantId)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_A_CLUB),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myClubProvider.doesMyPlayerExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER_FOR_CLUB),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myClubProvider.isMyPlayerAvailable(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_PLAYER_IS_NOT_AVAILABLE),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    this.validateFields(dto.name, dto.description, dto.logoPath, clientErrors);
    if (clientErrors.length > 0) {
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        clientErrors,
        null,
        null,
      );
    }
    clientErrors = [];
    const model: IMyClubModel = await this.myClubProvider.createMyClub(
      participantId,
      dto.name,
      dto.description,
      dto.logoPath,
    );
    return new GenericResponse<IMyClubResData>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      MyClubResData.fromModel(model),
      null,
    );
  }

  public async putMyClub(
    participantId: number,
    dto: IMyClubReqDto,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IMyClubResData | null>> {
    if (!(await this.myClubProvider.doesMyClubExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_CLUB),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    this.validateFields(dto.name, dto.description, dto.logoPath, clientErrors);
    if (clientErrors.length > 0) {
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        clientErrors,
        null,
        null,
      );
    }
    clientErrors = [];
    const model: IMyClubModel = await this.myClubProvider.updateMyClub(
      participantId,
      dto.name,
      dto.description,
      dto.logoPath,
    );
    return new GenericResponse<IMyClubResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyClubResData.fromModel(model),
      null,
    );
  }

  public async deleteMyClub(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<void | null>> {
    if (!(await this.myClubProvider.doesMyClubExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_CLUB),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myClubProvider.isMyClubDeletable(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.CLUB_CANNOT_BE_DELETED),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    await this.myClubProvider.deleteMyClub(participantId);
    return new GenericResponse<void>(
      new HttpStatus(HttpStatusCode.NO_CONTENT),
      null,
      clientErrors,
      null,
      null,
    );
  }

  private validateFields(
    name: string,
    description: string,
    logoPath: string,
    clientErrors: IClientError[],
  ): void {
    // Name validation
    if (
      !isStringInLengthBetween(name, CLUB_NAME_MIN_LENGTH, CLUB_NAME_MAX_LENGTH)
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_CLUB_NAME_LENGTH),
      );
    }
    // Description validation
    if (
      !isStringInLengthBetween(
        description,
        CLUB_DESCRIPTION_MIN_LENGTH,
        CLUB_DESCRIPTION_MAX_LENGTH,
      )
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_BIOGRAPHY_LENGTH),
      );
    }
    // Logo path validation
    if (!isStringMatchingRegex(logoPath, URL_MUST_REGEX)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_CLUB_LOGO_PATH_CONTENT),
      );
    }
  }
}
