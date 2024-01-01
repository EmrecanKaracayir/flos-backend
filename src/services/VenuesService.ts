import { IVenueModel } from "../interfaces/models/IVenueModel";
import { IVenuesProvider } from "../interfaces/providers/IVenuesProvider";
import { IAppResponse } from "../interfaces/schemas/responses/IAppResponse";
import {
  ClientErrorCode,
  IClientError,
} from "../interfaces/schemas/responses/app/IClientError";
import { HttpStatusCode } from "../interfaces/schemas/responses/app/IHttpStatus";
import { IVenues$Res } from "../interfaces/schemas/responses/routes/venues/$venueId/IVenues$Res";
import { IVenuesRes } from "../interfaces/schemas/responses/routes/venues/IVenuesRes";
import { IVenuesService } from "../interfaces/services/IVenuesService";
import { VenuesProvider } from "../providers/VenuesProvider";
import { AppResponse } from "../schemas/responses/AppResponse";
import { ClientError } from "../schemas/responses/app/ClientError";
import { HttpStatus } from "../schemas/responses/app/HttpStatus";
import { VenuesRes } from "../schemas/responses/routes/venues/VenuesRes";

export class VenuesService implements IVenuesService {
  public readonly venuesProvider: IVenuesProvider;

  constructor() {
    this.venuesProvider = new VenuesProvider();
  }

  public async getVenues(
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IVenuesRes[]>> {
    const models: IVenueModel[] = await this.venuesProvider.getVenues();
    return new AppResponse<IVenuesRes[]>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      VenuesRes.fromModels(models),
      null,
    );
  }

  public async getVenues$(
    venueId: number,
    clientErrors: IClientError[],
  ): Promise<IAppResponse<IVenues$Res | null>> {
    const model: IVenueModel | null =
      await this.venuesProvider.getVenue(venueId);
    if (!model) {
      clientErrors.push(
        new ClientError(ClientErrorCode.NO_VENUE_FOUND_IN_VENUES),
      );
      return new AppResponse<null>(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        clientErrors,
        null,
        null,
      );
    }
    return new AppResponse<IVenues$Res>(
      new HttpStatus(HttpStatusCode.OK),
      null,
      clientErrors,
      VenuesRes.fromModel(model),
      null,
    );
  }
}
