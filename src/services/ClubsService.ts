import { IClubModel } from "../interfaces/models/IClubModel";
import { IClubsProvider } from "../interfaces/providers/IClubsProvider";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IClubsRes } from "../interfaces/schemas/responses/routes/clubs/IClubsRes";
import { IClubsService } from "../interfaces/services/IClubsService";
import { ClubsProvider } from "../providers/ClubsProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { ClubsRes } from "../schemas/responses/routes/clubs/ClubsRes";

export class ClubsService implements IClubsService {
  public readonly clubsProvider: IClubsProvider;

  constructor() {
    this.clubsProvider = new ClubsProvider();
  }

  public async getClubs(
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IClubsRes[]>> {
    const models: IClubModel[] = await this.clubsProvider.getClubs();
    return new AppResponse<IClubsRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      ClubsRes.fromModels(models),
      null,
    );
  }

  public async getClubs$(
    clubId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IClubsRes | null>> {
    const model: IClubModel | null = await this.clubsProvider.getClub(clubId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_CLUB_FOUND_IN_CLUBS),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IClubsRes>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      ClubsRes.fromModel(model),
      null,
    );
  }
}
