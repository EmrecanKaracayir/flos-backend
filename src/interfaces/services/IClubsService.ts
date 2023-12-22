import { IClubsProvider } from "../providers/IClubsProvider";
import { IGenericResponse } from "../schemas/responses/IGenericResponse";
import { IClientError } from "../schemas/responses/common/IClientError";
import { IClubsResData } from "../schemas/responses/routes/clubs/IClubsResData";

export interface IClubsService {
  readonly clubsProvider: IClubsProvider;

  getClubs: (
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IClubsResData[]>>;

  getClubs$clubId: (
    clubId: number,
    clientErrors: IClientError[],
  ) => Promise<IGenericResponse<IClubsResData | null>>;
}
