import { IClubsProvider } from "../providers/IClubsProvider";
import { IAppResponse } from "../schemas/responses/IAppResponse";
import { IClientError } from "../schemas/responses/app/IClientError";
import { IClubsRes } from "../schemas/responses/routes/clubs/IClubsRes";

export interface IClubsService {
  readonly clubsProvider: IClubsProvider;

  getClubs: (
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IClubsRes[]>>;

  getClubs$: (
    clubId: number,
    clientErrors: IClientError[],
  ) => Promise<IAppResponse<IClubsRes | null>>;
}
