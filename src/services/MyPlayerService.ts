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
import { IMyPlayerReq } from "../interfaces/schemas/requests/routes/my/player/IMyPlayerReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IMyPlayerRes } from "../interfaces/schemas/responses/routes/my/player/IMyPlayerRes";
import { IMyPlayerService } from "../interfaces/services/IMyPlayerService";
import { MyPlayerProvider } from "../providers/MyPlayerProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { MyPlayerRes } from "../schemas/responses/routes/my/player/MyPlayerRes";

export class MyPlayerService implements IMyPlayerService {
  public readonly myPlayerProvider: IMyPlayerProvider;

  constructor() {
    this.myPlayerProvider = new MyPlayerProvider();
  }

  public async getMyPlayer(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyPlayerRes | null>> {
    const model: IMyPlayerModel | null =
      await this.myPlayerProvider.getMyPlayer(participantId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IMyPlayerRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyPlayerRes.fromModel(model),
      null,
    );
  }

  public async postMyPlayer(
    participantId: number,
    req: IMyPlayerReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyPlayerRes | null>> {
    if (await this.myPlayerProvider.doesMyPlayerExist(participantId)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_A_PLAYER),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    this.validateFields(
      req.fullName,
      req.birthday,
      req.biography,
      req.imgPath,
      clientErrors,
    );
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
    const model: IMyPlayerModel = await this.myPlayerProvider.createMyPlayer(
      participantId,
      req.fullName,
      req.birthday,
      req.biography,
      req.imgPath,
    );
    return new AppResponse<IMyPlayerRes>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      MyPlayerRes.fromModel(model),
      null,
    );
  }

  public async putMyPlayer(
    participantId: number,
    req: IMyPlayerReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyPlayerRes | null>> {
    if (!(await this.myPlayerProvider.doesMyPlayerExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myPlayerProvider.isMyPlayerEditable(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PLAYER_CANNOT_BE_EDITED),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    this.validateFields(
      req.fullName,
      req.birthday,
      req.biography,
      req.imgPath,
      clientErrors,
    );
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
    const model: IMyPlayerModel = await this.myPlayerProvider.updateMyPlayer(
      participantId,
      req.fullName,
      req.birthday,
      req.biography,
      req.imgPath,
    );
    return new AppResponse<IMyPlayerRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyPlayerRes.fromModel(model),
      null,
    );
  }

  public async deleteMyPlayer(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<void | null>> {
    if (!(await this.myPlayerProvider.doesMyPlayerExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER),
      );
      return new AppResponse<null>(
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
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    await this.myPlayerProvider.deleteMyPlayer(participantId);
    return new AppResponse<void>(
      new HttpStatus(HttpStatusCode.NO_CONTENT),
      null,
      clientErrors,
      null,
      null,
    );
  }

  public async deleteMyPlayerResign(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<void | null>> {
    if (!(await this.myPlayerProvider.doesMyPlayerExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_PLAYER),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (await this.myPlayerProvider.amITheCaptain(participantId)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PLAYER_CANNOT_RESIGN_AS_CAPTAIN),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myPlayerProvider.isClubEditable(participantId))) {
      clientErrors.push(new ClientError(ClientErrorCode.PLAYER_CANNOT_RESIGN));
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    await this.myPlayerProvider.resignFromClub(participantId);
    return new AppResponse<void>(
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
        new ClientError(ClientErrorCode.INVALID_PLAYER_BIRTHDAY_CONTENT),
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
        new ClientError(ClientErrorCode.INVALID_PLAYER_BIOGRAPHY_LENGTH),
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
