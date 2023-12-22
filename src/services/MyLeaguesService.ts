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
import { IMyLeagueModel } from "../interfaces/models/IMyLeagueModel";
import { IMyLeaguesProvider } from "../interfaces/providers/IMyLeaguesProvider";
import { IMyLeaguesReqDto } from "../interfaces/schemas/requests/routes/my/leagues/IMyLeaguesReqDto";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { IMyLeaguesResData } from "../interfaces/schemas/responses/routes/my/leagues/IMyLeaguesResData";
import { IMyLeaguesService } from "../interfaces/services/IMyLeaguesService";
import { MyLeaguesProvider } from "../providers/MyLeaguesProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { MyLeaguesResData } from "../schemas/responses/routes/my/leagues/MyLeaguesResData";

export class MyLeaguesService implements IMyLeaguesService {
  public readonly myLeaguesProvider: IMyLeaguesProvider;

  constructor() {
    this.myLeaguesProvider = new MyLeaguesProvider();
  }

  public async getMyLeagues(
    organizerId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IMyLeaguesResData[]>> {
    const models: IMyLeagueModel[] =
      await this.myLeaguesProvider.getMyLeagueModels(organizerId);
    return new GenericResponse<IMyLeaguesResData[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyLeaguesResData.fromModels(models),
      null,
    );
  }

  public async postMyLeagues(
    organizerId: number,
    dto: IMyLeaguesReqDto,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IMyLeaguesResData | null>> {
    this.validateFields(
      dto.name,
      dto.prize,
      dto.description,
      dto.logoPath,
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
    const model: IMyLeagueModel = await this.myLeaguesProvider.createLeague(
      organizerId,
      dto.name,
      dto.prize,
      dto.description,
      dto.logoPath,
    );
    return new GenericResponse<IMyLeaguesResData>(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      clientErrors,
      MyLeaguesResData.fromModel(model),
      null,
    );
  }

  public async getMyLeagues$leagueId(
    organizerId: number,
    leagueId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IMyLeaguesResData | null>> {
    const model: IMyLeagueModel | null =
      await this.myLeaguesProvider.getMyLeagueModelById(organizerId, leagueId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_LEAGUE_FOUND_IN_MY_LEAGUES),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<IMyLeaguesResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      MyLeaguesResData.fromModel(model),
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
        new ClientError(ClientErrorCode.INVALID_LOGO_PATH_CONTENT),
      );
    }
  }
}
