import { URL_MUST_REGEX } from "../core/rules/common/urlRules";
import {
  LEAGUE_DESCRIPTION_MAX_LENGTH,
  LEAGUE_DESCRIPTION_MIN_LENGTH,
  LEAGUE_NAME_MAX_LENGTH,
  LEAGUE_NAME_MIN_LENGTH,
} from "../core/rules/leagueRules";
import {
  isStringInLengthBetween,
  isStringMatchingRegex,
} from "../core/utils/strings";
import { IClubModel } from "../interfaces/models/IClubModel";
import { IMyLeagueClubModel } from "../interfaces/models/IMyLeagueClubModel";
import { IMyLeagueModel } from "../interfaces/models/IMyLeagueModel";
import { IMyLeaguesProvider } from "../interfaces/providers/IMyLeaguesProvider";
import { IMyLeagues$ClubsReq } from "../interfaces/schemas/requests/routes/my/leagues/$leagueId/clubs/IMyLeagues$ClubsReq";
import { IMyLeaguesReq } from "../interfaces/schemas/requests/routes/my/leagues/IMyLeaguesReq";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IMyLeagues$Clubs$Res } from "../interfaces/schemas/responses/routes/my/leagues/$leagueId/clubs/$clubId/IMyLeagues$Clubs$Res";
import { IMyLeagues$ClubsRes } from "../interfaces/schemas/responses/routes/my/leagues/$leagueId/clubs/IMyLeagues$ClubsRes";
import { IMyLeaguesRes } from "../interfaces/schemas/responses/routes/my/leagues/IMyLeaguesRes";
import { IMyLeaguesService } from "../interfaces/services/IMyLeaguesService";
import { MyLeaguesProvider } from "../providers/MyLeaguesProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { MyLeagues$Clubs$Res } from "../schemas/responses/routes/my/leagues/$leagueId/clubs/$clubId/MyLeagues$Clubs$Res";
import { MyLeagues$ClubsRes } from "../schemas/responses/routes/my/leagues/$leagueId/clubs/MyLeagues$ClubsRes";
import { MyLeaguesRes } from "../schemas/responses/routes/my/leagues/MyLeaguesRes";

export class MyLeaguesService implements IMyLeaguesService {
  public readonly myLeaguesProvider: IMyLeaguesProvider;

  constructor() {
    this.myLeaguesProvider = new MyLeaguesProvider();
  }

  public async getMyLeagues(
    organizerId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyLeaguesRes[]>> {
    const models: IMyLeagueModel[] =
      await this.myLeaguesProvider.getMyLeagues(organizerId);
    return new AppResponse<IMyLeaguesRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyLeaguesRes.fromModels(models),
      null,
    );
  }

  public async postMyLeagues(
    organizerId: number,
    req: IMyLeaguesReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyLeaguesRes | null>> {
    this.validateFields(
      req.name,
      req.prize,
      req.description,
      req.logoPath,
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
    const model: IMyLeagueModel = await this.myLeaguesProvider.createMyLeague(
      organizerId,
      req.name,
      req.prize,
      req.description,
      req.logoPath,
    );
    return new AppResponse<IMyLeaguesRes>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      MyLeaguesRes.fromModel(model),
      null,
    );
  }

  public async getMyLeagues$(
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyLeaguesRes | null>> {
    const model: IMyLeagueModel | null =
      await this.myLeaguesProvider.getMyLeague(organizerId, leagueId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_LEAGUE_FOUND_IN_MY_LEAGUES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IMyLeaguesRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyLeaguesRes.fromModel(model),
      null,
    );
  }

  public async putMyLeagues$(
    organizerId: number,
    leagueId: number,
    req: IMyLeaguesReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyLeaguesRes | null>> {
    if (
      !(await this.myLeaguesProvider.doesMyLeagueExist(organizerId, leagueId))
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_LEAGUE_FOUND_IN_MY_LEAGUES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myLeaguesProvider.isMyLeagueEditable(leagueId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.LEAGUE_CANNOT_BE_EDITED),
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
      req.name,
      req.prize,
      req.description,
      req.logoPath,
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
    const model: IMyLeagueModel = await this.myLeaguesProvider.updateMyLeague(
      organizerId,
      leagueId,
      req.name,
      req.prize,
      req.description,
      req.logoPath,
    );
    return new AppResponse<IMyLeaguesRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyLeaguesRes.fromModel(model),
      null,
    );
  }

  public async deleteMyLeagues$(
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<void | null>> {
    if (
      !(await this.myLeaguesProvider.doesMyLeagueExist(organizerId, leagueId))
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_LEAGUE_FOUND_IN_MY_LEAGUES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myLeaguesProvider.isMyLeagueDeletable(leagueId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.LEAGUE_CANNOT_BE_DELETED),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    await this.myLeaguesProvider.deleteMyLeague(leagueId);
    return new AppResponse<void>(
      new HttpStatus(HttpStatusCode.NO_CONTENT),
      null,
      clientErrors,
      null,
      null,
    );
  }

  public async getMyLeagues$Clubs(
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyLeagues$ClubsRes[]>> {
    if (
      !(await this.myLeaguesProvider.doesMyLeagueExist(organizerId, leagueId))
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_LEAGUE_FOUND_IN_MY_LEAGUES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    const models: IMyLeagueClubModel[] =
      await this.myLeaguesProvider.getMyLeagueClubs(leagueId);
    return new AppResponse<IMyLeagues$ClubsRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyLeagues$ClubsRes.fromModels(models),
      null,
    );
  }

  public async postMyLeagues$Clubs(
    organizerId: number,
    leagueId: number,
    req: IMyLeagues$ClubsReq,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IMyLeagues$Clubs$Res>> {
    if (
      !(await this.myLeaguesProvider.doesMyLeagueExist(organizerId, leagueId))
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_LEAGUE_FOUND_IN_MY_LEAGUES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myLeaguesProvider.isMyLeagueEditable(leagueId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.LEAGUE_CANNOT_BE_EDITED),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myLeaguesProvider.doesClubExist(req.clubId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.CLUB_NOT_FOUND_FOR_ADDITION),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myLeaguesProvider.isClubAvailable(req.clubId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.CLUB_NOT_AVAILABLE_FOR_ADDITION),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    const model: IClubModel = await this.myLeaguesProvider.addClubToMyLeague(
      leagueId,
      req.clubId,
    );
    return new AppResponse<IMyLeagues$Clubs$Res>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      MyLeagues$Clubs$Res.fromModel(model),
      null,
    );
  }

  public async deleteMyLeagues$Clubs$(
    organizerId: number,
    leagueId: number,
    clubId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<void | null>> {
    if (
      !(await this.myLeaguesProvider.doesMyLeagueExist(organizerId, leagueId))
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_LEAGUE_FOUND_IN_MY_LEAGUES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myLeaguesProvider.isMyLeagueEditable(leagueId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.LEAGUE_CANNOT_BE_EDITED),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    if (!(await this.myLeaguesProvider.isClubInLeague(leagueId, clubId))) {
      clientErrors.push(
        new ClientError(ClientErrorCode.CLUB_NOT_FOUND_FOR_REMOVAL),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        clientErrors,
        null,
        null,
      );
    }
    await this.myLeaguesProvider.removeClubFromMyLeague(clubId);
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
    prize: number,
    description: string,
    logoPath: string,
    clientErrors: IClientError[],
  ): void {
    // Name validation
    if (
      !isStringInLengthBetween(
        name,
        LEAGUE_NAME_MIN_LENGTH,
        LEAGUE_NAME_MAX_LENGTH,
      )
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_LEAGUE_NAME_LENGTH),
      );
    }
    // Prize validation
    if (prize < 0 || Number.isSafeInteger(prize) === false) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_LEAGUE_PRIZE_VALUE),
      );
    }
    // Description validation
    if (
      !isStringInLengthBetween(
        description,
        LEAGUE_DESCRIPTION_MIN_LENGTH,
        LEAGUE_DESCRIPTION_MAX_LENGTH,
      )
    ) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_LEAGUE_DESCRIPTION_LENGTH),
      );
    }
    // Logo path validation
    if (!isStringMatchingRegex(logoPath, URL_MUST_REGEX)) {
      clientErrors.push(
        new ClientError(ClientErrorCode.INVALID_LEAGUE_LOGO_PATH_CONTENT),
      );
    }
  }
}
