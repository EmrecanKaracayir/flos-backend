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
import { IMyClubPlayerModel } from "../interfaces/models/IMyClubPlayerModel";
import { IPlayerModel } from "../interfaces/models/IPlayerModel";
import { IMyClubProvider } from "../interfaces/providers/IMyClubProvider";
import { IMyClubReq } from "../interfaces/schemas/requests/routes/my/club/IMyClubReq";
import { IMyClubPlayersReq } from "../interfaces/schemas/requests/routes/my/club/players/IMyClubPlayersReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IMyClubRes } from "../interfaces/schemas/responses/routes/my/club/IMyClubRes";
import { IMyClubPlayersRes } from "../interfaces/schemas/responses/routes/my/club/players/IMyClubPlayersRes";
import { IMyClubService } from "../interfaces/services/IMyClubService";
import { MyClubProvider } from "../providers/MyClubProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { MyClubRes } from "../schemas/responses/routes/my/club/MyClubRes";
import { MyClubPlayersRes } from "../schemas/responses/routes/my/club/players/MyClubPlayersRes";

export class MyClubService implements IMyClubService {
  public readonly myClubProvider: IMyClubProvider;

  constructor() {
    this.myClubProvider = new MyClubProvider();
  }

  public async getMyClub(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyClubRes | null>> {
    const model: IMyClubModel | null =
      await this.myClubProvider.getMyClub(participantId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_CLUB),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IMyClubRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyClubRes.fromModel(model),
      null,
    );
  }

  public async postMyClub(
    participantId: number,
    req: IMyClubReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyClubRes | null>> {
    if (await this.myClubProvider.doesMyClubExist(participantId)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_A_CLUB),
      );
      return new AppResponse<null>(
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
      return new AppResponse<null>(
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
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    this.validateFields(req.name, req.description, req.logoPath, clientErrors);
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
    const model: IMyClubModel = await this.myClubProvider.createMyClub(
      participantId,
      req.name,
      req.description,
      req.logoPath,
    );
    return new AppResponse<IMyClubRes>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      MyClubRes.fromModel(model),
      null,
    );
  }

  public async putMyClub(
    participantId: number,
    req: IMyClubReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyClubRes | null>> {
    if (!(await this.myClubProvider.doesMyClubExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_CLUB),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myClubProvider.isMyClubEditable(participantId))) {
      clientErrors.push(new ClientError(ClientErrorCode.CLUB_CANNOT_BE_EDITED));
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    this.validateFields(req.name, req.description, req.logoPath, clientErrors);
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
    const model: IMyClubModel = await this.myClubProvider.updateMyClub(
      participantId,
      req.name,
      req.description,
      req.logoPath,
    );
    return new AppResponse<IMyClubRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyClubRes.fromModel(model),
      null,
    );
  }

  public async deleteMyClub(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<void | null>> {
    if (!(await this.myClubProvider.doesMyClubExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_CLUB),
      );
      return new AppResponse<null>(
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
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    await this.myClubProvider.deleteMyClub(participantId);
    return new AppResponse<void>(
      new HttpStatus(HttpStatusCode.NO_CONTENT),
      null,
      clientErrors,
      null,
      null,
    );
  }

  public async getMyClubPlayers(
    participantId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyClubPlayersRes[] | null>> {
    if (!(await this.myClubProvider.doesMyClubExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_CLUB),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    const models: IMyClubPlayerModel[] =
      await this.myClubProvider.getMyClubPlayers(participantId);
    return new AppResponse<IMyClubPlayersRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyClubPlayersRes.fromModels(models),
      null,
    );
  }

  public async postMyClubPlayers(
    participantId: number,
    req: IMyClubPlayersReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyClubPlayersRes | null>> {
    if (!(await this.myClubProvider.doesMyClubExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_CLUB),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myClubProvider.isMyClubEditable(participantId))) {
      clientErrors.push(new ClientError(ClientErrorCode.CLUB_CANNOT_BE_EDITED));
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myClubProvider.doesPlayerExist(req.playerId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PLAYER_NOT_FOUND_FOR_ADDITION),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myClubProvider.isPlayerAvailable(req.playerId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PLAYER_NOT_AVAILABLE_FOR_ADDITION),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    const model: IPlayerModel = await this.myClubProvider.addPlayerToMyClub(
      participantId,
      req.playerId,
    );
    return new AppResponse<IMyClubPlayersRes>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      MyClubPlayersRes.fromModel(model),
      null,
    );
  }

  public async deleteMyClubPlayers$(
    participantId: number,
    playerId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<void | null>> {
    if (!(await this.myClubProvider.doesMyClubExist(participantId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PARTICIPANT_HAS_NO_CLUB),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myClubProvider.isMyClubEditable(participantId))) {
      clientErrors.push(new ClientError(ClientErrorCode.CLUB_CANNOT_BE_EDITED));
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myClubProvider.doesPlayerExist(playerId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PLAYER_NOT_FOUND_FOR_REMOVAL),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (
      !(await this.myClubProvider.isPlayerInMyClub(participantId, playerId))
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.PLAYER_NOT_FOUND_FOR_REMOVAL),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (await this.myClubProvider.isPlayerMine(participantId, playerId)) {
      clientErrors.push(new ClientError(ClientErrorCode.CANNOT_REMOVE_CAPTAIN));
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    await this.myClubProvider.removePlayerFromMyClub(playerId);
    return new AppResponse<void>(
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
        new ClientError(ClientErrorCode.INVALID_CLUB_DESCRIPTION_LENGTH),
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
