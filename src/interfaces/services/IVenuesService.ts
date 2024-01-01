import { IVenuesProvider } from "../providers/IVenuesProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IVenues$Res } from "../schemas/responses/routes/venues/$venueId/IVenues$Res";
import { IVenuesRes } from "../schemas/responses/routes/venues/IVenuesRes";

export interface IVenuesService {
  readonly venuesProvider: IVenuesProvider;

  getVenues: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IVenuesRes[]>>;

  getVenues$: (
    venueId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IVenues$Res | null>>;
}
