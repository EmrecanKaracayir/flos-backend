import { DATE_MUST_REGEX } from "../core/rules/common/dateRules";
import { URL_MUST_REGEX } from "../core/rules/common/urlRules";
import {
  PLAYER_BIOGRAPHY_MAX_LENGTH,
  PLAYER_BIOGRAPHY_MIN_LENGTH,
  PLAYER_FULL_NAME_MAX_LENGTH,
  PLAYER_FULL_NAME_MIN_LENGTH,
} from "../core/rules/playerRules";
import {
  isStringInLengthBetween,
  isStringMatchingRegex,
} from "../core/utils/strings";
import { IMyPlayerModel } from "../interfaces/models/IMyPlayerModel";
import { IMyPlayerProvider } from "../interfaces/providers/IMyPlayerProvider";
import { IMyPlayerReqDto } from "../interfaces/schemas/requests/routes/my/player/IMyPlayerReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { IMyPlayerResData } from "../interfaces/schemas/responses/routes/my/player/IMyPlayerResData";
import { IMyPlayerService } from "../interfaces/services/IMyPlayerService";
import { MyPlayerProvider } from "../providers/MyPlayerProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { MyPlayerResData } from "../schemas/responses/routes/my/player/MyPlayerResData";

export class MyPlayerService implements IMyPlayerService {
  public readonly myPlayerProvider: IMyPlayerProvider;

  constructor() {
    this.myPlayerProvider = new MyPlayerProvider();
  }

  public async getMyPlayer(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IMyPlayerResData | null>> {
    const model: IMyPlayerModel | null =
      await this.myPlayerProvider.getMyPlayerModel(participantId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<IMyPlayerResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyPlayerResData.fromModel(model),
      null,
    );
  }

  public async postMyPlayer(
    participantId: number,
    dto: IMyPlayerReqDto,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IMyPlayerResData | null>> {
    if (await this.myPlayerProvider.doesMyPlayerExist(participantId)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_A_PLAYER),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    this.validateFields(
      dto.fullName,
      dto.birthday,
      dto.biography,
      dto.imgPath,
      clientErrors,
    );
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
    const model: IMyPlayerModel = await this.myPlayerProvider.createMyPlayer(
      participantId,
      dto.fullName,
      dto.birthday,
      dto.biography,
      dto.imgPath,
    );
    return new GenericResponse<IMyPlayerResData>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      MyPlayerResData.fromModel(model),
      null,
    );
  }

  public async putMyPlayer(
    participantId: number,
    dto: IMyPlayerReqDto,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IMyPlayerResData | null>> {
    if (!(await this.myPlayerProvider.doesMyPlayerExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    this.validateFields(
      dto.fullName,
      dto.birthday,
      dto.biography,
      dto.imgPath,
      clientErrors,
    );
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
    const model: IMyPlayerModel = await this.myPlayerProvider.updateMyPlayer(
      participantId,
      dto.fullName,
      dto.birthday,
      dto.biography,
      dto.imgPath,
    );
    return new GenericResponse<IMyPlayerResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyPlayerResData.fromModel(model),
      null,
    );
  }

  public async deleteMyPlayer(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<void | null>> {
    if (!(await this.myPlayerProvider.doesMyPlayerExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myPlayerProvider.isMyPlayerDeletable(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PLAYER_CANNOT_BE_DELETED),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    await this.myPlayerProvider.deleteMyPlayer(participantId);
    return new GenericResponse<void>(
      new HttpStatus(HttpStatusCode.NO_CONTENT),
      null,
      clientErrors,
      null,
      null,
    );
  }

  private validateFields(
    fullName: string,
    birthday: string,
    biography: string,
    imgPath: string,
    clientErrors: IClientError[],
  ): void {
    // Full name validation
    if (
      !isStringInLengthBetween(
        fullName,
        PLAYER_FULL_NAME_MIN_LENGTH,
        PLAYER_FULL_NAME_MAX_LENGTH,
      )
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_PLAYER_FULL_NAME_LENGTH),
      );
    }
    // Birthday validation
    if (!isStringMatchingRegex(birthday, DATE_MUST_REGEX)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_USERNAME_CONTENT),
      );
    }
    // Biography validation
    if (
      !isStringInLengthBetween(
        biography,
        PLAYER_BIOGRAPHY_MIN_LENGTH,
        PLAYER_BIOGRAPHY_MAX_LENGTH,
      )
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_BIOGRAPHY_LENGTH),
      );
    }
    // Image path validation
    if (!isStringMatchingRegex(imgPath, URL_MUST_REGEX)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_PLAYER_IMAGE_PATH_CONTENT),
      );
    }
  }
}
