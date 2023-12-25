import { IVenuesProvider } from "../providers/IVenuesProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IVenuesRes } from "../schemas/responses/routes/venues/IVenuesRes";

export interface IVenuesService {
  readonly venuesProvider: IVenuesProvider;

  getVenues: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IVenuesRes[]>>;

  getVenues$: (
    venueId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IVenuesRes | null>>;
}
