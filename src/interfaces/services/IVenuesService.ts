import { IVenuesProvider } from "../providers/IVenuesProvider";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { IVenuesResData } from "../schemas/responses/routes/venues/IVenuesResData";

export interface IVenuesService {
  readonly venuesProvider: IVenuesProvider;

  getVenues: (
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IVenuesResData[]>>;

  getVenues$venueId: (
    venueId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IVenuesResData>>;
}
