import { IClubModel } from "../interfaces/models/IClubModel";
import { IClubsProvider } from "../interfaces/providers/IClubsProvider";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { IClubsResData } from "../interfaces/schemas/responses/routes/clubs/IClubsResData";
import { IClubsService } from "../interfaces/services/IClubsService";
import { ClubsProvider } from "../providers/ClubsProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { ClubsResData } from "../schemas/responses/routes/clubs/ClubsResData";

export class ClubsService implements IClubsService {
  public readonly clubsProvider: IClubsProvider;

  constructor() {
    this.clubsProvider = new ClubsProvider();
  }

  public async getClubs(
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IClubsResData[]>> {
    const clubModels: IClubModel[] = await this.clubsProvider.getClubModels();
    return new GenericResponse<IClubsResData[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      ClubsResData.fromModels(clubModels),
      null,
    );
  }

  public async getClubs$clubId(
    clubId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IClubsResData>> {
    const clubModel: IClubModel | null =
      await this.clubsProvider.getClubModelById(clubId);
    if (!clubModel) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_CLUB_FOUND_IN_CLUBS),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<IClubsResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      ClubsResData.fromModel(clubModel),
      null,
    );
  }
}
