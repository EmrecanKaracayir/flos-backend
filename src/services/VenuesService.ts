import { IVenueModel } from "../interfaces/models/IVenueModel";
import { IVenuesProvider } from "../interfaces/providers/IVenuesProvider";
import { IGenericResponse } from "../interfaces/schemas/responses/IGenericResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/common/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/common/IHttpStatus";
import { IVenuesResData } from "../interfaces/schemas/responses/routes/venues/IVenuesResData";
import { IVenuesService } from "../interfaces/services/IVenuesService";
import { VenuesProvider } from "../providers/VenuesProvider";
import { GenericResponse } from "../schemas/responses/GenericResponse";
import { ClientError } from "../schemas/responses/common/ClientError";
import { HttpStatus } from "../schemas/responses/common/HttpStatus";
import { VenuesResData } from "../schemas/responses/routes/venues/VenuesResData";

export class VenuesService implements IVenuesService {
  public readonly venuesProvider: IVenuesProvider;

  constructor() {
    this.venuesProvider = new VenuesProvider();
  }

  public async getVenues(
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IVenuesResData[]>> {
    const models: IVenueModel[] = await this.venuesProvider.getVenueModels();
    return new GenericResponse<IVenuesResData[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      VenuesResData.fromModels(models),
      null,
    );
  }

  public async getVenues$venueId(
    venueId: number,
    clientErrors: IClientError[],
  ): Promise<IGenericResponse<IVenuesResData | null>> {
    const model: IVenueModel | null =
      await this.venuesProvider.getVenueModelById(venueId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_VENUE_FOUND_IN_VENUES),
      );
      return new GenericResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new GenericResponse<IVenuesResData>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      VenuesResData.fromModel(model),
      null,
    );
  }
}
